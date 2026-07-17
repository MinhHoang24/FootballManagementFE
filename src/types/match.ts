import { Dayjs } from "dayjs";

export type GoalTeam = "OUR" | "OPPONENT";

export type GoalType = "NORMAL" | "OWN_GOAL";

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

export interface IScore {
    our: number;
    opponent: number;
}

export interface IGoal {
    team: GoalTeam;
    type: GoalType;
    minute: number | null;
    scorerPlayerId: IPlayerRef | null;
    assistPlayerId: IPlayerRef | null;
}

export interface IGoalInput {
    team: GoalTeam;
    type: GoalType;
    minute: number | null;
    scorerPlayerId: string | null;
    assistPlayerId: string | null;
    quantity?: number;
}

export interface IMatch {
    _id: string;
    season: number;
    opponent: string;
    matchDate: string;

    goals: IGoal[];

    // Virtual từ backend
    score: IScore;

    createdAt: string;
    updatedAt: string;
}

export interface ICreateMatchBody {
    season: number;
    opponent: string;
    matchDate: string;

    goals: IGoalInput[];
}

export type IUpdateMatchBody = ICreateMatchBody;

export interface IMatchFormValues
    extends Omit<ICreateMatchBody, "matchDate"> {
    matchDate: Dayjs;
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
}

export interface IGetMatchDetailResponse {
    success: boolean;
    data: IMatch;
}