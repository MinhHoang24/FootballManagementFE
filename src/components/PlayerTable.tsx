"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deletePlayer, getListPlayers } from "../api/player";
import { IPlayer } from "../types/player";
import { Input, Space, Button, Dropdown, MenuProps, message, Modal } from "antd";
import Table, { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { SorterResult } from "antd/es/table/interface";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import PlayerModal from "./PlayerModal";
import PlayerDetailDrawer from "./PlayerDetailDrawer";

export default function PlayerTable() {
    const [keyword, setKeyword] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<keyof IPlayer>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [openModal, setOpenModal] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<IPlayer>();
    const queryClient = useQueryClient();
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>();

    const { data, isFetching } = useQuery({
        queryKey: [
            "players",
            page,
            pageSize,
            search,
            sortBy,
            sortOrder,
        ],
        queryFn: () =>
            getListPlayers({
                page,
                limit: pageSize,
                search,
                sortBy,
                sortOrder,
            }),
    });

    const deleteMutation = useMutation({
        mutationFn: deletePlayer,

        onSuccess: () => {
            message.success("Delete player successfully");

            queryClient.invalidateQueries({
                queryKey: ["players"],
            });
        },

        onError: () => {
            message.error("Delete failed");
        },
    });

    const confirmDelete = (player: IPlayer) => {
        Modal.confirm({
            title: "Delete Player",
            content: `Are you sure you want to delete "${player.name}"?`,
            okText: "Delete",
            okButtonProps: {
                danger: true,
            },
            cancelText: "Cancel",

            onOk() {
                deleteMutation.mutate(player._id);
            },
        });
    };

    const columns: ColumnsType<IPlayer> = [
        {
            title: "No.",
            key: "index",
            width: 80,
            align: "center",
            render: (_, __, index) => (
                (page - 1) * pageSize + index + 1
            ),
        },
        {
            title: "Player",
            dataIndex: "name",
            key: "name",
            sorter: true,
        },
        {
            title: "Number",
            dataIndex: "number",
            key: "number",
            sorter: true,
            width: 120,
            align: "center",
        },
        {
            title: "Position",
            dataIndex: "position",
            key: "position",
            sorter: true,
            width: 140,
            align: "center",
            render: (position: IPlayer["position"]) => {
                const colorMap: Record<IPlayer["position"], string> = {
                    ST: "bg-red-700",
                    GK: "bg-yellow-600",
                    CB: "bg-blue-700",
                    CM: "bg-green-700",
                };

                return (
                    <span
                        className={`
                            inline-flex
                            min-w-12
                            justify-center
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-white
                            ${colorMap[position]}
                        `}
                    >
                        {position}
                    </span>
                );
            },
        },
        {
            title: "Shirt Size",
            dataIndex: "shirtSize",
            key: "shirtSize",
            sorter: true,
            width: 120,
            align: "center",
        },
        {
            title: "Action",
            key: "action",
            width: 80,
            align: "center",
            render: (_, record) => {
                const items: MenuProps["items"] = [
                    {
                        key: "edit",
                        label: "Update",
                        onClick: () => {
                            setEditingPlayer(record);
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
        sorter: SorterResult<IPlayer> | SorterResult<IPlayer>[]
    ) => {
        setPage(pagination.current || 1);
        setPageSize(pagination.pageSize || 10);

        if (!Array.isArray(sorter) && sorter.field) {
            if (!sorter.order) {
                setSortBy("createdAt");
                setSortOrder("desc");
            } else {
                setSortBy(sorter.field as keyof IPlayer);
                setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
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
                <Space.Compact>
                    <Input
                        allowClear
                        prefix={<SearchOutlined />}
                        placeholder="Search player..."
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
                        className="!bg-green-800 hover:!bg-green-900 !border-green-800 hover:!border-green-900 !text-white"
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={() => {
                            setSearch(keyword);
                            setPage(1);
                        }}
                    >
                        Search
                    </Button>
                </Space.Compact>

                <Button
                    className="!bg-green-800 hover:!bg-green-900 !border-green-800 hover:!border-green-900 !text-white"
                    type="primary"
                    onClick={() => {
                        setEditingPlayer(undefined);
                        setOpenModal(true);
                    }}
                >
                    Add Player
                </Button>
            </div>

            <Table<IPlayer>
                rowKey="_id"
                columns={columns}
                dataSource={data?.items ?? []}
                loading={isFetching}
                pagination={{
                    current: page,
                    pageSize,
                    total: data?.pagination.total ?? 0,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} players`,
                }}
                onChange={handleTableChange}
                rowClassName={() => "cursor-pointer"}
                onRow={(record) => ({
                    onClick: () => {
                        setSelectedPlayerId(record._id);
                        setOpenDetail(true);
                    },
                })}
            />

            <PlayerDetailDrawer
                open={openDetail}
                playerId={selectedPlayerId}
                onClose={() => {
                    setOpenDetail(false);
                    setSelectedPlayerId(undefined);
                }}
            />

            <PlayerModal
                open={openModal}
                player={editingPlayer}
                onClose={() => {
                    setOpenModal(false);
                    setEditingPlayer(undefined);
                }}
                onSuccess={() => {
                    queryClient.invalidateQueries({
                        queryKey: ["players"],
                    });
                }}
            />
        </Space>
    );
}