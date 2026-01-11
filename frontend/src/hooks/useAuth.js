import { useEffect } from "react";
import { useAuth } from "../store/auth";
import API from "../api/api";

export default function useAuthSync() {
    const { user, setUser, logout } = useAuth();

    useEffect(() => {
        if (!user) {
            API.get("/users/current-user")
                .then((res) => setUser(res.data.data))
                .catch(() => logout());
        }
        // eslint-disable-next-line
    }, []);

    return { user };
}