// import axios from "axios";
// import { toast } from "react-toastify";

// const API = axios.create({
//     // baseURL: "https://video-tube-bay.vercel.app/api/v1",
//     baseURL: "https://videotube-lo7n.onrender.com/api/v1",
//     withCredentials: true,
// });

// API.interceptors.response.use(
//     (res) => res,
//     (err) => {
//         const msg =
//             err.response?.data?.message ||
//             err.response?.data?.error ||
//             err.message ||
//             "Something went wrong";
//         if (err.response?.status !== 401) toast.error(msg);
//         return Promise.reject(err);
//     }
// );

// export default API;



import axios from 'axios';
import { useAuth } from '../store/auth';

// Create axios instance
const API = axios.create({
    baseURL: "https://videotube-lo7n.onrender.com/api/v1",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
API.interceptors.request.use(
    (config) => {
        const state = useAuth.getState();
        const { accessToken, isTokenExpired } = state;

        // Add token to request if available and not expired
        if (accessToken && !isTokenExpired()) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
            console.log('🚀 API Request:', {
                url: config.url,
                method: config.method?.toUpperCase(),
                hasAuth: !!config.headers.Authorization,
                timestamp: new Date().toISOString()
            });
        }

        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
API.interceptors.response.use(
    (response) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ API Response:', {
                url: response.config?.url,
                status: response.status,
                method: response.config?.method?.toUpperCase()
            });
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const { refreshAccessToken, logout, refreshToken } = useAuth.getState();

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // If we have a refresh token, try to refresh
            if (refreshToken) {
                try {
                    console.log('🔄 Attempting token refresh...');
                    await refreshAccessToken();

                    // Retry the original request with new token
                    const newToken = useAuth.getState().accessToken;
                    if (newToken) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return API(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('❌ Token refresh failed:', refreshError);
                    logout();

                    // Redirect to login page
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
            } else {
                // No refresh token available, logout user
                console.log('🚪 No refresh token, logging out');
                logout();

                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        }

        // Log errors in development
        if (process.env.NODE_ENV === 'development') {
            console.error('❌ API Error:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                message: error.message,
                url: error.config?.url,
                method: error.config?.method?.toUpperCase(),
                data: error.response?.data
            });
        }

        return Promise.reject(error);
    }
);

// Utility function to make authenticated requests
export const makeAuthenticatedRequest = async (config) => {
    const { isAuthenticated, accessToken } = useAuth.getState();

    if (!isAuthenticated || !accessToken) {
        throw new Error('User not authenticated');
    }

    return API(config);
};

// API methods for common operations
export const authAPI = {
    // Login
    login: async (credentials) => {
        try {
            const response = await API.post('/auth/login', credentials);

            // Update auth store with response
            const { setTokens, setUser } = useAuth.getState();
            const { user, accessToken, refreshToken } = response.data;

            setUser(user);
            setTokens({ accessToken, refreshToken });

            return response.data;
        } catch (error) {
            console.error('Login API error:', error);
            throw error;
        }
    },

    // Register
    register: async (userData) => {
        try {
            const response = await API.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Register API error:', error);
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            await API.post('/auth/logout');
        } catch (error) {
            console.error('Logout API error:', error);
            // Don't throw error for logout, just log it
        } finally {
            // Always clear local auth state
            useAuth.getState().logout();
        }
    },

    // Get current user
    me: async () => {
        const response = await API.get('/auth/me');
        return response.data;
    },

    // Refresh token
    refresh: async () => {
        const { refreshToken } = useAuth.getState();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await API.post('/auth/refresh', { refreshToken });
        return response.data;
    }
};

// Export default API instance
export default API;