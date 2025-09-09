// import { create } from "zustand";

// export const useAuth = create((set) => ({
//     user: null,
//     accessToken: null,
//     refreshToken: null,
//     isLoading: false,
//     setUser: (user) => set({ user }),
//     setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
//     logout: () => set({ user: null, accessToken: null, refreshToken: null }),
// }));



import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

// Token management utilities
const getStoredToken = (key) => {
    try {
        // Try localStorage first
        let token = localStorage.getItem(key);
        if (token) return token;

        // Fallback to sessionStorage
        token = sessionStorage.getItem(key);
        if (token) return token;

        // Fallback to cookies (for incognito mode)
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${key}=`))
            ?.split('=')[1];

        return cookieValue || null;
    } catch (error) {
        console.error(`Error getting ${key}:`, error);
        return null;
    }
};

const setStoredToken = (key, value) => {
    try {
        if (value) {
            // Store in localStorage
            localStorage.setItem(key, value);
            // Store in sessionStorage as backup
            sessionStorage.setItem(key, value);
            // Store in cookies for incognito mode
            const isSecure = location.protocol === 'https:';
            document.cookie = `${key}=${value}; path=/; SameSite=Strict${isSecure ? '; Secure' : ''}; max-age=86400`; // 24 hours
        } else {
            // Clear from all storage
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
            document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
    } catch (error) {
        console.error(`Error setting ${key}:`, error);
    }
};

const clearAllTokens = () => {
    setStoredToken('accessToken', null);
    setStoredToken('refreshToken', null);
};

// Enhanced Auth Store
export const useAuth = create(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                // State
                user: null,
                accessToken: null,
                refreshToken: null,
                isLoading: false,
                isAuthenticated: false,
                error: null,

                // Initialize auth from storage
                initialize: () => {
                    set({ isLoading: true });
                    try {
                        const accessToken = getStoredToken('accessToken');
                        const refreshToken = getStoredToken('refreshToken');
                        const userString = getStoredToken('user');

                        let user = null;
                        if (userString) {
                            try {
                                user = JSON.parse(userString);
                            } catch (e) {
                                console.error('Error parsing stored user:', e);
                            }
                        }

                        set({
                            accessToken,
                            refreshToken,
                            user,
                            isAuthenticated: !!(accessToken && user),
                            isLoading: false
                        });

                        console.log('Auth initialized:', {
                            hasAccessToken: !!accessToken,
                            hasRefreshToken: !!refreshToken,
                            hasUser: !!user,
                            isAuthenticated: !!(accessToken && user)
                        });

                    } catch (error) {
                        console.error('Auth initialization failed:', error);
                        set({
                            isLoading: false,
                            error: 'Failed to initialize auth',
                            isAuthenticated: false
                        });
                    }
                },

                // Login action
                login: async (credentials) => {
                    set({ isLoading: true, error: null });
                    try {
                        // Your login API call here
                        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include', // Important for cookies
                            body: JSON.stringify(credentials),
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Login failed');
                        }

                        const data = await response.json();
                        const { user, accessToken, refreshToken } = data;

                        // Store tokens in multiple places
                        setStoredToken('accessToken', accessToken);
                        setStoredToken('refreshToken', refreshToken);
                        setStoredToken('user', JSON.stringify(user));

                        set({
                            user,
                            accessToken,
                            refreshToken,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        });

                        console.log('Login successful:', { user: user?.email, hasTokens: !!(accessToken && refreshToken) });
                        return data;

                    } catch (error) {
                        console.error('Login failed:', error);
                        set({
                            isLoading: false,
                            error: error.message,
                            isAuthenticated: false
                        });
                        throw error;
                    }
                },

                // Set user
                setUser: (user) => {
                    setStoredToken('user', JSON.stringify(user));
                    set({ user });
                },

                // Set tokens
                setTokens: ({ accessToken, refreshToken }) => {
                    setStoredToken('accessToken', accessToken);
                    if (refreshToken) {
                        setStoredToken('refreshToken', refreshToken);
                    }

                    set({
                        accessToken,
                        refreshToken: refreshToken || get().refreshToken,
                        isAuthenticated: true
                    });
                },

                // Refresh token
                refreshAccessToken: async () => {
                    const { refreshToken } = get();
                    if (!refreshToken) {
                        throw new Error('No refresh token available');
                    }

                    try {
                        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({ refreshToken }),
                        });

                        if (!response.ok) {
                            throw new Error('Token refresh failed');
                        }

                        const data = await response.json();
                        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;

                        // Update tokens
                        setStoredToken('accessToken', newAccessToken);
                        if (newRefreshToken) {
                            setStoredToken('refreshToken', newRefreshToken);
                        }

                        set({
                            accessToken: newAccessToken,
                            refreshToken: newRefreshToken || refreshToken,
                            isAuthenticated: true
                        });

                        console.log('Token refreshed successfully');
                        return newAccessToken;

                    } catch (error) {
                        console.error('Token refresh failed:', error);
                        // If refresh fails, logout user
                        get().logout();
                        throw error;
                    }
                },

                // Logout
                logout: () => {
                    console.log('Logging out user');
                    clearAllTokens();
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        error: null
                    });
                },

                // Clear error
                clearError: () => set({ error: null }),

                // Check if token is expired (basic check)
                isTokenExpired: () => {
                    const { accessToken } = get();
                    if (!accessToken) return true;

                    try {
                        // Decode JWT token (basic decode without verification)
                        const base64Url = accessToken.split('.')[1];
                        if (!base64Url) return true;

                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(
                            atob(base64)
                                .split('')
                                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                                .join('')
                        );

                        const payload = JSON.parse(jsonPayload);
                        const currentTime = Date.now() / 1000;

                        return payload.exp < currentTime;
                    } catch (error) {
                        console.error('Error checking token expiration:', error);
                        return true;
                    }
                }
            }),
            {
                name: 'auth-store', // Storage key
                partialize: (state) => ({
                    // Only persist these fields
                    user: state.user,
                    accessToken: state.accessToken,
                    refreshToken: state.refreshToken,
                    isAuthenticated: state.isAuthenticated
                }),
                onRehydrateStorage: () => (state) => {
                    // Called after store rehydration
                    console.log('Auth store rehydrated:', state);
                    if (state) {
                        state.initialize();
                    }
                }
            }
        )
    )
);

// Initialize auth when the module loads
if (typeof window !== 'undefined') {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        useAuth.getState().initialize();
    }, 100);
}

// Subscribe to auth changes for debugging
if (process.env.NODE_ENV === 'development') {
    useAuth.subscribe(
        (state) => state.isAuthenticated,
        (isAuthenticated) => {
            console.log('Auth state changed:', { isAuthenticated });
        }
    );
}

// Export helper functions
export const getAuthToken = () => useAuth.getState().accessToken;
export const isAuthenticated = () => useAuth.getState().isAuthenticated;
export const getCurrentUser = () => useAuth.getState().user;