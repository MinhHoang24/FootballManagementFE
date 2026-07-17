export enum ContributionStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    EXCUSED = "EXCUSED",
}

export enum TransactionType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE",
}

export enum TransactionCategory {
    MONTHLY_FEE = "MONTHLY_FEE",
    FIELD = "FIELD",
    WATER = "WATER",
    FOOD = "FOOD",
    OTHER = "OTHER",
}

export interface IContribution {
    _id: string;

    year: number;

    month: number;

    playerId: {
        _id: string;
        name: string;
        number: number;
        avatar: string;
    };

    amount: number;

    status: ContributionStatus;

    note: string;

    paidAt?: string;

    createdAt: string;

    updatedAt: string;
}

export interface IFinanceTransaction {
    _id: string;

    type: TransactionType;

    category: TransactionCategory;

    amount: number;

    description: string;

    transactionDate: string;

    contributionId?: string;

    createdAt: string;

    updatedAt: string;
}

export interface IFinanceSummary {
    income: number;

    expense: number;

    balance: number;

    paidPlayers: number;

    unpaidPlayers: number;

    excusedPlayers: number;
}

export interface IInitMonthBody {
    year: number;

    month: number;

    defaultAmount: number;
}

export interface IPayContributionBody {
    amount: number;

    paidAt?: string;

    note?: string;
}

export interface IExcuseContributionBody {
    note?: string;
}

export interface ICreateExpenseBody {
    category: TransactionCategory;

    amount: number;

    description: string;

    transactionDate: string;
}

export type IUpdateExpenseBody = Partial<ICreateExpenseBody>;

export interface IContributionQuery {
    year: number;

    month: number;
}

export interface ITransactionQuery {
    year?: number;

    month?: number;

    type?: TransactionType;
}

export interface ISummaryQuery {
    year: number;

    month?: number;
}