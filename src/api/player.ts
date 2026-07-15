import api from "../lib/axios";
import { IPlayerListQuery, IPlayerListResponse, IPlayerUpdateBody } from "../types/player";

export const getListPlayers = async (
    body: IPlayerListQuery
): Promise<IPlayerListResponse> => {
    const res = await api.get<IPlayerListResponse>("/players", { params: body });
    return res.data;
};

export const updatePlayer = async (
    id: string,
    body: IPlayerUpdateBody
) => {
    const res = await api.put(`/players/${id}`, body);
    return res.data;
}

export const createPlayer = async (body: IPlayerUpdateBody) => {
    const res = await api.post(`/players`, body);
    return res.data;
}

export const deletePlayer = async (id: string) => {
    const res = await api.delete(`/players/${id}`);
    return res.data;
}

export const getPlayerDetail = async (id: string) => {
    const res = await api.get(`/players/${id}`);
    return res.data;
}