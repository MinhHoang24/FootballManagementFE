"use client";

import { initMonth } from "@/src/api/finance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, InputNumber, message, Modal } from "antd";
import { AxiosError } from "axios";

interface Props {
    open: boolean;
    year: number;
    month: number;
    onCancel: () => void;
}

interface IFormValues {
    defaultAmount: number;
}

export default function InitContributionModal({
    open,
    year,
    month,
    onCancel,
}: Props) {
    const [form] = Form.useForm<IFormValues>();

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: initMonth,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["finance-contributions"],
            });

            onCancel();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            message.error(
                error.response?.data?.message ??
                    "Khởi tạo tháng thất bại."
            );
        },
    });

    const handleFinish = (values: IFormValues) => {
        mutate({
            year,
            month,
            defaultAmount: values.defaultAmount,
        });
    };

    return (
        <Modal
            title={`Khởi tạo tháng ${month}/${year}`}
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    defaultAmount: 200000,
                }}
                onFinish={handleFinish}
            >
                <Form.Item
                    label="Số tiền mặc định"
                    name="defaultAmount"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập số tiền.",
                        },
                    ]}
                >
                    <InputNumber<number>
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) =>
                            value != null
                                ? value.toLocaleString("vi-VN")
                                : ""
                        }
                        parser={(value) =>
                            Number(value?.replace(/\./g, "") ?? 0)
                        }
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                        style={{ marginRight: 8 }}
                        onClick={onCancel}
                    >
                        Hủy
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                    >
                        Khởi tạo
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}