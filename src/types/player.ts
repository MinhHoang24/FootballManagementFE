export type TPlayerPosition = "GK" | "CB" | "CM" | "ST";

export type TShirtSize = "S" | "M" | "L" | "XL" | "XXL";

export interface IPlayerSeasonStat {
    _id: string;
    playerId: string;
    season: number;
    goals: number;
    assists: number;
    ga: number;
    createdAt: string;
    updatedAt: string;
}

export interface IPlayer {
    _id: string;
    name: string;
    number: number;
    shirtSize: TShirtSize;
    position: TPlayerPosition;
    avatar: string;
    seasonStats: IPlayerSeasonStat[];
    createdAt: string;
    updatedAt: string;
}

export interface IPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface IPlayerListResponse {
    success: boolean;
    items: IPlayer[];
    pagination: IPagination;
}

export type TPlayerSortBy =
    | "name"
    | "number"
    | "position"
    | "shirtSize"
    | "createdAt"
    | "goals"
    | "assists"
    | "ga";

export interface IPlayerListQuery {
    page?: number;
    limit?: number;
    search?: string;
    season: number;
    sortBy?: TPlayerSortBy;
    sortOrder?: "asc" | "desc";
}

export interface IPlayerUpdateBody {
    name?: string;
    number?: number;
    shirtSize?: TShirtSize;
    position?: TPlayerPosition;
    avatar?: string;
}