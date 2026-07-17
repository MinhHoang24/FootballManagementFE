

import api from "../lib/axios";
import {
    IContribution,
    IContributionQuery,
    ICreateExpenseBody,
    IExcuseContributionBody,
    IFinanceSummary,
    IFinanceTransaction,
    IInitMonthBody,
    IPayContributionBody,
    ISummaryQuery,
    ITransactionQuery,
    IUpdateExpenseBody,
} from "../types/finance";

/**
 * Summary
 */

export const getFinanceSummary = async (
    params: ISummaryQuery
) => {
    const { data } = await api.get<IFinanceSummary>(
        "/finance/summary",
        {
            params,
        }
    );

    return data;
};

/**
 * Contribution
 */

export const getContributions = async (
    params: IContributionQuery
) => {
    const { data } = await api.get<
        IContribution[]
    >("/finance/contributions", {
        params,
    });

    return data;
};

export const initMonth = async (
    body: IInitMonthBody
) => {
    const { data } = await api.post(
        "/finance/contributions/init",
        body
    );

    return data;
};

export const payContribution = async (
    id: string,
    body: IPayContributionBody
) => {
    const { data } = await api.patch(
        `/finance/contributions/${id}/pay`,
        body
    );

    return data;
};

export const unpayContribution = async (
    id: string
) => {
    const { data } = await api.patch(
        `/finance/contributions/${id}/unpay`
    );

    return data;
};

export const excuseContribution = async (
    id: string,
    body: IExcuseContributionBody
) => {
    const { data } = await api.patch(
        `/finance/contributions/${id}/excuse`,
        body
    );

    return data;
};

/**
 * Transaction
 */

export const getTransactions = async (
    params?: ITransactionQuery
) => {
    const { data } = await api.get<
        IFinanceTransaction[]
    >("/finance/transactions", {
        params,
    });

    return data;
};

export const createExpense = async (
    body: ICreateExpenseBody
) => {
    const { data } = await api.post(
        "/finance/transactions",
        body
    );

    return data;
};

export const updateExpense = async (
    id: string,
    body: IUpdateExpenseBody
) => {
    const { data } = await api.patch(
        `/finance/transactions/${id}`,
        body
    );

    return data;
};

export const deleteExpense = async (
    id: string
) => {
    const { data } = await api.delete(
        `/finance/transactions/${id}`
    );

    return data;
};