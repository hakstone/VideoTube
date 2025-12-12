import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
    // baseURL: "http://localhost:8000/api/v1",
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
        const msg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Something went wrong";
        if (err.response?.status !== 401) toast.error(msg);
        return Promise.reject(err);
    }
);

export default API;