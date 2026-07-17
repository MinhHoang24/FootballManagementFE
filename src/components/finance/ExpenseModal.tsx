"use client";

import {
    createExpense,
    updateExpense,
} from "@/src/api/finance";
import {
    ICreateExpenseBody,
    IFinanceTransaction,
    TransactionCategory,
} from "@/src/types/finance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    message,
} from "antd";
import { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";

interface Props {
    open: boolean;
    expense?: IFinanceTransaction;
    year: number;
    month: number;
    onCancel: () => void;
}

interface IFormValues {
    category: TransactionCategory;
    amount: number;
    description: string;
    transactionDate: Dayjs;
}

export default function ExpenseModal({
    open,
    expense,
    year,
    month,
    onCancel,
}: Props) {
    const [form] = Form.useForm<IFormValues>();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!open) return;

        if (expense) {
            form.setFieldsValue({
                category: expense.category,
                amount: expense.amount,
                description: expense.description,
                transactionDate: dayjs(
                    expense.transactionDate
                ),
            });
        } else {
            form.resetFields();

            form.setFieldsValue({
                category: TransactionCategory.FIELD,
                transactionDate: dayjs(),
            });
        }
    }, [open, expense, form]);

    const { mutate, isPending } = useMutation({
        mutationFn: (body: ICreateExpenseBody) => {
            if (expense) {
                return updateExpense(expense._id, body);
            }

            return createExpense(body);
        },

        onSuccess: () => {
            messageApi.success(
                expense
                    ? "Cập nhật thành công."
                    : "Thêm khoản chi thành công."
            );

            queryClient.invalidateQueries({
                queryKey: [
                    "finance-transactions",
                    year,
                    month,
                ],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    "finance-summary",
                    year,
                    month,
                ],
            });

            onCancel();
        },

        onError: (
            error: AxiosError<{ message: string }>
        ) => {
            messageApi.error(
                error.response?.data.message ??
                    "Có lỗi xảy ra."
            );
        },
    });

    const handleFinish = (
        values: IFormValues
    ) => {
        mutate({
            category: values.category,
            amount: values.amount,
            description: values.description,
            transactionDate:
                values.transactionDate.toISOString(),
        });
    };

    return (
        <>
            {contextHolder}

            <Modal
                title={
                    expense
                        ? "Chỉnh sửa khoản chi"
                        : "Thêm khoản chi"
                }
                open={open}
                footer={null}
                onCancel={onCancel}
                destroyOnHidden
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    <Form.Item
                        name="category"
                        label="Loại"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Vui lòng chọn loại.",
                            },
                        ]}
                    >
                        <Select
                            options={[
                                {
                                    label: "Tiền sân",
                                    value:
                                        TransactionCategory.FIELD,
                                },
                                {
                                    label: "Nước",
                                    value:
                                        TransactionCategory.WATER,
                                },
                                {
                                    label: "Ăn uống",
                                    value:
                                        TransactionCategory.FOOD,
                                },
                                {
                                    label: "Khác",
                                    value:
                                        TransactionCategory.OTHER,
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="amount"
                        label="Số tiền"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Vui lòng nhập số tiền.",
                            },
                        ]}
                    >
                        <InputNumber<number>
                            style={{ width: "100%" }}
                            min={0}
                            formatter={(value) =>
                                value
                                    ? Number(
                                          value
                                      ).toLocaleString(
                                          "vi-VN"
                                      )
                                    : ""
                            }
                            parser={(value) =>
                                Number(
                                    value?.replace(
                                        /\./g,
                                        ""
                                    ) ?? 0
                                )
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="transactionDate"
                        label="Ngày"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Vui lòng chọn ngày.",
                            },
                        ]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Nội dung"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Vui lòng nhập nội dung.",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            maxLength={300}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        style={{
                            marginBottom: 0,
                            textAlign: "right",
                        }}
                    >
                        <Button
                            onClick={onCancel}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Hủy
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPending}
                        >
                            {expense
                                ? "Cập nhật"
                                : "Thêm"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}