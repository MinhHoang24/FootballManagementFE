"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Input, MenuProps, message, Modal, Select, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";

import { deleteMatch, getListMatches } from "../api/match";
import { SorterResult } from "antd/es/table/interface";
import { IMatch } from "../types/match";

import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import MatchModal from "./MatchModal";
import MatchDetailModal from "./MatchDetailModal";

export default function MatchTable() {
    const [keyword, setKeyword] = useState("");
    const [search, setSearch] = useState("");
    const [season, setSeason] = useState<number>();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [sortBy, setSortBy] = useState<keyof IMatch>("matchDate");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const [openModal, setOpenModal] = useState(false);
    const [editingMatch, setEditingMatch] = useState<IMatch>();

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedMatchId, setSelectedMatchId] = useState<string>();

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteMatch,

        onSuccess: () => {
            message.success("Delete match successfully");

            queryClient.invalidateQueries({
                queryKey: ["matches"],
            });
        },

        onError: () => {
            message.error("Delete failed");
        },
    });

    const confirmDelete = (match: IMatch) => {
        Modal.confirm({
            title: "Delete Match",
            content: `Delete match vs ${match.opponent}?`,
            okText: "Delete",
            cancelText: "Cancel",
            okButtonProps: {
                danger: true,
            },

            onOk() {
                deleteMutation.mutate(match._id);
            },
        });
    };

    const { data, isFetching } = useQuery({
        queryKey: [
            "matches",
            page,
            pageSize,
            search,
            season,
            sortBy,
            sortOrder,
        ],
        queryFn: () =>
            getListMatches({
                page,
                limit: pageSize,
                search,
                season,
                sortBy,
                sortOrder,
            }),
    });

    const columns: ColumnsType<IMatch> = [
        {
            title: "No.",
            width: 70,
            align: "center",
            render: (_, __, index) =>
                (page - 1) * pageSize + index + 1,
        },
        {
            title: "Date",
            dataIndex: "matchDate",
            key: "matchDate",
            sorter: true,
            render: (value) => dayjs(value).format("DD/MM/YYYY"),
        },
        {
            title: "Opponent",
            dataIndex: "opponent",
            key: "opponent",
            sorter: true,
        },
        {
            title: "Score",
            align: "center",
            render: (_, record) =>
                `${record.score.our} - ${record.score.opponent}`,
        },
        {
            title: "Result",
            align: "center",
            render: (_, record) => {
                if (record.score.our > record.score.opponent) {
                    return (
                        <span className="inline-flex rounded-full bg-green-700 px-3 py-1 text-xs font-semibold text-white">
                            Win
                        </span>
                    );
                }

                if (record.score.our < record.score.opponent) {
                    return (
                        <span className="inline-flex rounded-full bg-red-700 px-3 py-1 text-xs font-semibold text-white">
                            Loss
                        </span>
                    );
                }

                return (
                    <span className="inline-flex rounded-full bg-yellow-600 px-3 py-1 text-xs font-semibold text-white">
                        Draw
                    </span>
                );
            },
        },
        {
            title: "Action",
            width: 80,
            align: "center",
            render: (_, record) => {
                const items: MenuProps["items"] = [
                    {
                        key: "edit",
                        label: "Update",
                        onClick: () => {
                            setEditingMatch(record);
                            setOpenModal(true);
                        },
                    },
                    {
                        key: "delete",
                        danger: true,
                        label: "Delete",
                        onClick: () => confirmDelete(record),
                    },
                ];

                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Dropdown
                            trigger={["click"]}
                            menu={{ items }}
                        >
                            <Button
                                icon={<MoreOutlined />}
                                type="text"
                            />
                        </Dropdown>
                    </div>
                );
            },
        },
    ];

    const handleTableChange = (
        pagination: TablePaginationConfig,
        _: unknown,
        sorter: SorterResult<IMatch> | SorterResult<IMatch>[]
    ) => {
        setPage(pagination.current || 1);
        setPageSize(pagination.pageSize || 10);

        if (!Array.isArray(sorter) && sorter.field) {
            if (!sorter.order) {
                setSortBy("matchDate");
                setSortOrder("desc");
            } else {
                setSortBy(sorter.field as keyof IMatch);
                setSortOrder(
                    sorter.order === "ascend"
                        ? "asc"
                        : "desc"
                );
            }
        }
    };

    return (
        <Space
            orientation="vertical"
            style={{ width: "100%" }}
            className="p-4"
        >
            <div className="flex justify-between items-center">
                <Space>
                    <Space.Compact>
                        <Input
                            allowClear
                            prefix={<SearchOutlined />}
                            placeholder="Search opponent..."
                            value={keyword}
                            onChange={(e) => {
                                const value = e.target.value;

                                setKeyword(value);

                                if (!value) {
                                    setSearch("");
                                    setPage(1);
                                }
                            }}
                            onPressEnter={() => {
                                setSearch(keyword);
                                setPage(1);
                            }}
                            style={{ width: 300 }}
                        />

                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            className="!bg-green-800 hover:!bg-green-900 !border-green-800 hover:!border-green-900 !text-white"
                            onClick={() => {
                                setSearch(keyword);
                                setPage(1);
                            }}
                        >
                            Search
                        </Button>
                    </Space.Compact>

                    <Select
                        allowClear
                        placeholder="Season"
                        style={{ width: 140 }}
                        value={season}
                        onChange={(value) => {
                            setSeason(value);
                            setPage(1);
                        }}
                        options={[
                            { label: "2026", value: 2026 },
                            { label: "2025", value: 2025 },
                        ]}
                    />
                </Space>

                <Button
                    type="primary"
                    className="!bg-green-800 hover:!bg-green-900 !border-green-800 hover:!border-green-900 !text-white"
                    onClick={() => {
                        setEditingMatch(undefined);
                        setOpenModal(true);
                    }}
                >
                    Add Match
                </Button>
            </div>

            <Table<IMatch>
                rowKey="_id"
                columns={columns}
                dataSource={data?.items ?? []}
                loading={isFetching}
                pagination={{
                    current: page,
                    pageSize,
                    total: data?.pagination.total ?? 0,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} matches`,
                }}
                scroll={{
                    y: "calc(100vh - 265px)",
                }}
                onChange={handleTableChange}
                rowClassName={() => "cursor-pointer"}
                onRow={(record) => ({
                    onClick: () => {
                        setSelectedMatchId(record._id);
                        setOpenDetail(true);
                    },
                })}
            />

            <MatchModal
                open={openModal}
                match={editingMatch}
                onClose={() => {
                    setOpenModal(false);
                    setEditingMatch(undefined);
                }}
                onSuccess={() => {
                    setEditingMatch(undefined);
                }}
            />

            <MatchDetailModal
                open={openDetail}
                matchId={selectedMatchId}
                onClose={() => {
                    setOpenDetail(false);
                    setSelectedMatchId(undefined);
                }}
            />
        </Space>
    );
}