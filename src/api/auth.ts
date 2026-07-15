import api from "../lib/axios";

export interface LoginPayload {
    username: string;
    password: string;
}

export interface Admin {
    id: string;
    username: string;
}

export const login = async (payload: LoginPayload) => {
    const { data } = await api.post("/auth/login", payload);

    return data;
};

export const logout = async () => {
    const { data } = await api.post("/auth/logout");

    return data;
};

export const getMe = async (): Promise<Admin> => {
    const { data } = await api.get("/auth/me");

    return data.admin;
};