import axios from "axios";

export let backend = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("UserId") ?? ""}`,
    },
});

export function set_auth_token(token: string) {
    backend = axios.create({
        baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
}

export type UserInfo = {
    UserId: string,
    Username: string,
}

