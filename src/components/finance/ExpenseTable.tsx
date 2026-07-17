"use client";

import { IFinanceTransaction, TransactionCategory } from "@/src/types/finance";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";


interface Props {
    data?: IFinanceTransaction[];
    loading?: boolean;

    onEdit?: (record: IFinanceTransaction) => void;
    onDelete?: (record: IFinanceTransaction) => void;
}

const categoryMap = {
    [TransactionCategory.MONTHLY_FEE]: {
        label: "Đóng quỹ",
        color: "green",
    },
    [TransactionCategory.FIELD]: {
        label: "Tiền sân",
        color: "blue",
    },
    [TransactionCategory.WATER]: {
        label: "Nước",
        color: "cyan",
    },
    [TransactionCategory.FOOD]: {
        label: "Ăn uống",
        color: "orange",
    },
    [TransactionCategory.OTHER]: {
        label: "Khác",
        color: "default",
    },
};

export default function ExpenseTable({
    data = [],
    loading,
    onEdit,
    onDelete,
}: Props) {
    const columns: ColumnsType<IFinanceTransaction> = [
        {
            title: "STT",
            width: 70,
            align: "center",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Ngày",
            dataIndex: "date",
            width: 120,
            align: "center",
            render: (value: string) =>
                dayjs(value).format("DD/MM/YYYY"),
        },
        {
            title: "Loại",
            dataIndex: "category",
            width: 140,
            align: "center",
            render: (category: TransactionCategory) => {
                const config = categoryMap[category];

                return (
                    <Tag color={config.color}>
                        {config.label}
                    </Tag>
                );
            },
        },
        {
            title: "Nội dung",
            dataIndex: "title",
            ellipsis: true,
        },
        {
            title: "Số tiền",
            dataIndex: "amount",
            width: 150,
            align: "right",
            render: (value: number) =>
                `${value.toLocaleString("vi-VN")} ₫`,
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            ellipsis: true,
        },
        {
            title: "",
            width: 60,
            align: "center",
            render: (_, record) => {
                const items: MenuProps["items"] = [
                    {
                        key: "edit",
                        label: "Chỉnh sửa",
                        onClick: () =>
                            onEdit?.(record),
                    },
                    {
                        key: "delete",
                        label: "Xóa",
                        danger: true,
                        onClick: () =>
                            onDelete?.(record),
                    },
                ];

                return (
                    <Dropdown
                        trigger={["click"]}
                        menu={{ items }}
                    >
                        <Button
                            type="text"
                            icon={<MoreOutlined />}
                        />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <Table<IFinanceTransaction>
            rowKey="_id"
            bordered
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={false}
        />
    );
}