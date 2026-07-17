"use client";

import { excuseContribution } from "@/src/api/finance";
import { IContribution } from "@/src/types/finance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Button,
    Form,
    Input,
    Modal,
    message,
} from "antd";
import { AxiosError } from "axios";
import { useEffect } from "react";

interface Props {
    open: boolean;
    contribution?: IContribution;
    onCancel: () => void;
}

interface IFormValues {
    note?: string;
}

export default function ExcuseContributionModal({
    open,
    contribution,
    onCancel,
}: Props) {
    const [form] = Form.useForm<IFormValues>();
    const [messageApi, contextHolder] = message.useMessage();

    const queryClient = useQueryClient();

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                note: contribution?.note,
            });
        } else {
            form.resetFields();
        }
    }, [open, contribution, form]);

    const { mutate, isPending } = useMutation({
        mutationFn: ({
            id,
            body,
        }: {
            id: string;
            body: IFormValues;
        }) => excuseContribution(id, body),

        onSuccess: () => {
            messageApi.success("Đã đánh dấu nghỉ.");

            queryClient.invalidateQueries({
                queryKey: [
                    "finance-contributions",
                    contribution?.year,
                    contribution?.month,
                ],
            });

            onCancel();
        },

        onError: (error: AxiosError<{ message: string }>) => {
            messageApi.error(
                error.response?.data?.message ??
                    "Có lỗi xảy ra."
            );
        },
    });

    const handleFinish = (values: IFormValues) => {
        if (!contribution) return;

        mutate({
            id: contribution._id,
            body: {
                note: values.note,
            },
        });
    };

    return (
        <>
            {contextHolder}

            <Modal
                title="Đánh dấu nghỉ"
                open={open}
                onCancel={onCancel}
                footer={null}
                destroyOnHidden
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    <Form.Item label="Cầu thủ">
                        <Input
                            value={contribution?.playerId.name}
                            readOnly
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ghi chú"
                        name="note"
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Ví dụ: Nghỉ phép, bận công việc..."
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
                            style={{ marginRight: 8 }}
                        >
                            Hủy
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPending}
                        >
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}