"use client";

import { MoreOutlined } from "@ant-design/icons";
import {
    Button,
    Dropdown,
    MenuProps,
    Table,
    Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import {
    ContributionStatus,
    IContribution,
} from "@/src/types/finance";

interface Props {
    data?: IContribution[];
    loading?: boolean;

    onPay?: (record: IContribution) => void;
    onExcuse?: (record: IContribution) => void;
    onUnpay?: (record: IContribution) => void;

    editable?: boolean;
}

export default function ContributionTable({
    data = [],
    loading,
    onPay,
    onExcuse,
    onUnpay,
    editable
}: Props) {
    const getMenus = (
        record: IContribution
    ): MenuProps["items"] => {
        switch (record.status) {
            case ContributionStatus.UNPAID:
                return [
                    {
                        key: "pay",
                        label: "Đóng quỹ",
                        onClick: () => onPay?.(record),
                    },
                    {
                        key: "excuse",
                        label: "Đánh dấu nghỉ",
                        onClick: () => onExcuse?.(record),
                    },
                ];

            case ContributionStatus.PAID:
                return [
                    {
                        key: "unpay",
                        danger: true,
                        label: "Hủy đóng",
                        onClick: () => onUnpay?.(record),
                    },
                ];

            case ContributionStatus.EXCUSED:
                return [
                    {
                        key: "pay",
                        label: "Đóng quỹ",
                        onClick: () => onPay?.(record),
                    },
                ];

            default:
                return [];
        }
    };

    const columns: ColumnsType<IContribution> = [
        {
            title: "STT",
            width: 70,
            align: "center",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Số áo",
            dataIndex: ["playerId", "number"],
            width: 80,
            align: "center",
        },
        {
            title: "Cầu thủ",
            dataIndex: ["playerId", "name"],
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 130,
            align: "center",
            render: (status: ContributionStatus) => {
                switch (status) {
                    case ContributionStatus.PAID:
                        return (
                            <Tag color="success">
                                Đã đóng
                            </Tag>
                        );

                    case ContributionStatus.UNPAID:
                        return (
                            <Tag color="error">
                                Chưa đóng
                            </Tag>
                        );

                    case ContributionStatus.EXCUSED:
                        return (
                            <Tag color="gold">
                                Nghỉ
                            </Tag>
                        );

                    default:
                        return null;
                }
            },
        },
        {
            title: "Số tiền",
            dataIndex: "amount",
            width: 140,
            align: "right",
            render: (value: number) =>
                `${value.toLocaleString("vi-VN")} ₫`,
        },
        {
            title: "Ngày đóng",
            dataIndex: "paidAt",
            width: 120,
            align: "center",
            render: (value?: string) =>
                value
                    ? dayjs(value).format("DD/MM/YYYY")
                    : "-",
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            ellipsis: true,
        },
    ];
    
    if (editable) {
        columns.push(
            {
                title: "Action",
                width: 100,
                align: "center",
                render: (_, record) => (
                    <Dropdown
                        trigger={["click"]}
                        menu={{
                            items: getMenus(record),
                        }}
                    >
                        <Button
                            type="text"
                            icon={<MoreOutlined />}
                        />
                    </Dropdown>
                ),
            }
        )
    }

    return (
        <Table<IContribution>
            rowKey="_id"
            bordered
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={false}
        />
    );
}