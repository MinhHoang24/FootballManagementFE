import { Dayjs } from "dayjs";

export interface IGetMatchListParams {
    page?: number;
    limit?: number;
    search?: string;
    season?: number;
    sortBy?: keyof IMatch;
    sortOrder?: "asc" | "desc";
}

export interface IPlayerRef {
    _id: string;
    name: string;
    number: number;
}

export interface IGoal {
    scorerPlayerId: IPlayerRef | null;
    assistPlayerId: IPlayerRef | null;
}

export interface IGoalInput {
    scorerPlayerId: string | null;
    assistPlayerId: string | null;
}

export interface IScore {
    our: number;
    opponent: number;
}

export interface IMatchBase {
    season: number;
    opponent: string;
    matchDate: string;
    score: IScore;
}

export interface IMatch extends IMatchBase {
    _id: string;
    goals: IGoal[];
    createdAt: string;
    updatedAt: string;
}

export interface ICreateMatchBody extends IMatchBase {
    goals: IGoalInput[];
}

export interface IGetMatchListResponse {
    success: boolean;
    items: IMatch[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IMatchResponse {
    success: boolean;
    data: IMatch;
}

export interface IDeleteMatchResponse {
    success: boolean;
    message: string;
    data: IMatch;
}

export interface IMatchFormValues
    extends Omit<ICreateMatchBody, "matchDate"> {
    matchDate: Dayjs;
}