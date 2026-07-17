"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import {
    Button,
    Card,
    ConfigProvider,
    DatePicker,
    Flex,
    Tabs,
    type TabsProps,
} from "antd";

import { getContributions, getFinanceSummary, getTransactions } from "@/src/api/finance";
import { IContribution, IFinanceTransaction, TransactionType } from "@/src/types/finance";

import ContributionTable from "./ContributionTable";
import InitContributionModal from "./InitContributionModal";
import ContributionModal from "./ContributionModal";
import ExcuseContributionModal from "./ExcuseContributionModal";
import FinanceSummary from "./FinanceSummary";
import ExpenseTable from "./ExpenseTable";
import ExpenseModal from "./ExpenseModal";

interface Props {
    editable?: boolean;
}

export default function AdminFinance({
    editable = false,
}: Props) {
    const [month, setMonth] = useState(dayjs());

    const [selectedContribution, setSelectedContribution] =
        useState<IContribution>();

    const [openInitModal, setOpenInitModal] = useState(false);
    const [openContributionModal, setOpenContributionModal] =
        useState(false);
    const [openExcuseModal, setOpenExcuseModal] =
        useState(false);
    const [openExpenseModal, setOpenExpenseModal] = useState(false);

    const [selectedExpense, setSelectedExpense] =
        useState<IFinanceTransaction>();

    const { data: expenses = [], isLoading: expenseLoading } = useQuery({
        queryKey: [
            "finance-transactions",
            month.year(),
            month.month() + 1,
        ],
        queryFn: () =>
            getTransactions({
                year: month.year(),
                month: month.month() + 1,
                type: TransactionType.EXPENSE,
            }),
    });

    const { data: summary } = useQuery({
        queryKey: [
            "finance-summary",
            month.year(),
            month.month() + 1,
        ],
        queryFn: () =>
            getFinanceSummary({
                year: month.year(),
                month: month.month() + 1,
            }),
    });

    const { data = [], isLoading } = useQuery({
        queryKey: [
            "finance-contributions",
            month.year(),
            month.month() + 1,
        ],
        queryFn: () =>
            getContributions({
                year: month.year(),
                month: month.month() + 1,
            }),
    });

    const closeContributionModal = () => {
        setOpenContributionModal(false);
        setSelectedContribution(undefined);
    };

    const closeExcuseModal = () => {
        setOpenExcuseModal(false);
        setSelectedContribution(undefined);
    };

    const items: TabsProps["items"] = [
        {
            key: "contributions",
            label: "Đóng quỹ",
            children: (
                <ContributionTable
                    data={data}
                    loading={isLoading}
                    onPay={(record) => {
                        setSelectedContribution(record);
                        setOpenContributionModal(true);
                    }}
                    onExcuse={(record) => {
                        setSelectedContribution(record);
                        setOpenExcuseModal(true);
                    }}
                />
            ),
        },
        {
            key: "transactions",
            label: "Chi tiêu",
            children: (
                <>
                    {editable && (
                        <Flex justify="end" style={{ marginBottom: 16 }}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    setSelectedExpense(undefined);
                                    setOpenExpenseModal(true);
                                }}
                            >
                                Thêm khoản chi
                            </Button>
                        </Flex>
                    )}
                    <ExpenseTable
                        data={expenses}
                        loading={expenseLoading}
                        onEdit={(record) => {
                            setSelectedExpense(record);
                            setOpenExpenseModal(true);
                        }}
                    />
                </>
            ),
        }
    ];

    return (
        <ConfigProvider
            theme={{
                components: {
                    Tabs: {
                        itemActiveColor: "#166534",
                        itemSelectedColor: "#166534",
                        inkBarColor: "#166534",
                        itemHoverColor: "#15803d",
                    },
                },
            }}
        >
            <Card title="Quản lý tài chính">
                <Flex
                    justify="space-between"
                    align="center"
                    style={{ marginBottom: 16 }}
                >
                    <DatePicker
                        picker="month"
                        allowClear={false}
                        value={month}
                        onChange={(value) =>
                            value && setMonth(value)
                        }
                    />

                    {editable  && data.length === 0 && (
                        <Button
                            type="primary"
                            onClick={() =>
                                setOpenInitModal(true)
                            }
                        >
                            Khởi tạo tháng
                        </Button>
                    )}
                </Flex>
                <FinanceSummary
                    totalIncome={summary?.income ?? 0}
                    totalExpense={summary?.expense ?? 0}
                    balance={summary?.balance ?? 0}
                    paidCount={summary?.paidPlayers ?? 0}
                    unpaidCount={summary?.unpaidPlayers ?? 0}
                    excusedCount={summary?.excusedPlayers ?? 0}
                />

                <Tabs
                    defaultActiveKey="contributions"
                    items={items}
                />
            </Card>

            <InitContributionModal
                open={openInitModal}
                year={month.year()}
                month={month.month() + 1}
                onCancel={() =>
                    setOpenInitModal(false)
                }
            />

            <ContributionModal
                open={openContributionModal}
                contribution={selectedContribution}
                onCancel={closeContributionModal}
            />

            <ExcuseContributionModal
                open={openExcuseModal}
                contribution={selectedContribution}
                onCancel={closeExcuseModal}
            />

            <ExpenseModal
                open={openExpenseModal}
                expense={selectedExpense}
                year={month.year()}
                month={month.month() + 1}
                onCancel={() => {
                    setOpenExpenseModal(false);
                    setSelectedExpense(undefined);
                }}
            />
        </ConfigProvider>
    );
}