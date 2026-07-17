"use client";

import { Card, Col, Row, Statistic } from "antd";
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    WalletOutlined,
    TeamOutlined,
    UserDeleteOutlined,
    UserOutlined,
} from "@ant-design/icons";

interface Props {
    totalIncome: number;
    totalExpense: number;
    balance: number;

    paidCount: number;
    unpaidCount: number;
    excusedCount: number;
}

export default function FinanceSummary({
    totalIncome,
    totalExpense,
    balance,
    paidCount,
    unpaidCount,
    excusedCount,
}: Props) {
    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
            <Col xs={24} sm={12} lg={6}>
                <Card>
                    <Statistic
                        title="Tổng thu"
                        value={totalIncome}
                        precision={0}
                        suffix="₫"
                        formatter={(value) =>
                            Number(value).toLocaleString("vi-VN")
                        }
                        prefix={
                            <ArrowUpOutlined
                                style={{ color: "#16a34a" }}
                            />
                        }
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card>
                    <Statistic
                        title="Tổng chi"
                        value={totalExpense}
                        precision={0}
                        suffix="₫"
                        formatter={(value) =>
                            Number(value).toLocaleString("vi-VN")
                        }
                        prefix={
                            <ArrowDownOutlined
                                style={{ color: "#dc2626" }}
                            />
                        }
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card>
                    <Statistic
                        title="Quỹ hiện tại"
                        value={balance}
                        precision={0}
                        suffix="₫"
                        formatter={(value) =>
                            Number(value).toLocaleString("vi-VN")
                        }
                        prefix={
                            <WalletOutlined
                                style={{ color: "#2563eb" }}
                            />
                        }
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
                <Card>
                    <Statistic
                        title="Đã đóng"
                        value={paidCount}
                        suffix={`/ ${
                            paidCount +
                            unpaidCount +
                            excusedCount
                        }`}
                        prefix={
                            <TeamOutlined
                                style={{ color: "#16a34a" }}
                            />
                        }
                    />
                </Card>
            </Col>

            <Col xs={24} sm={8}>
                <Card>
                    <Statistic
                        title="Chưa đóng"
                        value={unpaidCount}
                        prefix={
                            <UserOutlined
                                style={{ color: "#dc2626" }}
                            />
                        }
                    />
                </Card>
            </Col>

            <Col xs={24} sm={8}>
                <Card>
                    <Statistic
                        title="Nghỉ"
                        value={excusedCount}
                        prefix={
                            <UserDeleteOutlined
                                style={{ color: "#ca8a04" }}
                            />
                        }
                    />
                </Card>
            </Col>

            <Col xs={24} sm={8}>
                <Card>
                    <Statistic
                        title="Tỷ lệ đóng"
                        value={
                            paidCount +
                                unpaidCount +
                                excusedCount ===
                            0
                                ? 0
                                : (
                                      (paidCount /
                                          (paidCount +
                                              unpaidCount +
                                              excusedCount)) *
                                      100
                                  ).toFixed(1)
                        }
                        suffix="%"
                    />
                </Card>
            </Col>
        </Row>
    );
}