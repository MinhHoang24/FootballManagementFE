import api from "../lib/axios";
import {
    ICreateMatchBody,
    IDeleteMatchResponse,
    IGetMatchListParams,
    IGetMatchListResponse,
    IMatchResponse,
} from "../types/match";

export const getListMatches = async (
    params: IGetMatchListParams
): Promise<IGetMatchListResponse> => {
    const res = await api.get("/matches", {
        params,
    });

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
    body: ICreateMatchBody
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