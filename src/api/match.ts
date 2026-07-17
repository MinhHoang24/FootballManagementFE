import api from "../lib/axios";
import {
    ICreateMatchBody,
    IDeleteMatchResponse,
    IGetMatchDetailResponse,
    IGetMatchListParams,
    IGetMatchListResponse,
    IMatchResponse,
    IUpdateMatchBody,
} from "../types/match";

export const getListMatches = async (
    params: IGetMatchListParams
): Promise<IGetMatchListResponse> => {
    const res = await api.get("/matches", {
        params,
    });

    return res.data;
};

export const getMatchDetail = async (
    id: string
): Promise<IGetMatchDetailResponse> => {
    const res = await api.get(`/matches/${id}`);

    return res.data;
};

export const createMatch = async (
    body: ICreateMatchBody
): Promise<IMatchResponse> => {
    const res = await api.post("/matches", body);

    return res.data;
};

export const updateMatch = async (
    id: string,
    body: IUpdateMatchBody
): Promise<IMatchResponse> => {
    const res = await api.put(`/matches/${id}`, body);

    return res.data;
};

export const deleteMatch = async (
    id: string
): Promise<IDeleteMatchResponse> => {
    const res = await api.delete(`/matches/${id}`);

    return res.data;
};