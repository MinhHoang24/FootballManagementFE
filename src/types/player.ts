export type TPlayerPosition = "GK" | "CB" | "CM" | "ST";

export type TShirtSize = "S" | "M" | "L" | "XL" | "XXL";

export interface IPlayer {
    _id: string;
    name: string;
    number: number;
    shirtSize: TShirtSize;
    position: TPlayerPosition;
    avatar: string;
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

export interface IPlayerListQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: keyof IPlayer;
    sortOrder?: "asc" | "desc";
}

export interface IPlayerUpdateBody {
    name?: string;
    number?: number;
    shirtSize?: TShirtSize;
    position?: TPlayerPosition;
    avatar?: string;
}