"use client";

import { payContribution } from "@/src/api/finance";
import {
    IContribution,
    IPayContributionBody,
} from "@/src/types/finance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    message,
} from "antd";
import { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";

interface Props {
    open: boolean;
    contribution?: IContribution;
    onCancel: () => void;
}

interface IContributionFormValues {
    amount: number;
    paidAt: Dayjs;
    note?: string;
}

export default function ContributionModal({
    open,
    contribution,
    onCancel,
}: Props) {
    const [form] = Form.useForm<IContributionFormValues>();
    const [messageApi, contextHolder] = message.useMessage();

    const queryClient = useQueryClient();

    useEffect(() => {
        if (!open || !contribution) return;

        form.setFieldsValue({
            amount: contribution.amount,
            note: contribution.note,
            paidAt: dayjs(),
        });
    }, [open, contribution, form]);

    const { mutate, isPending } = useMutation({
        mutationFn: ({
            id,
            body,
        }: {
            id: string;
            body: IPayContributionBody;
        }) => payContribution(id, body),

        onSuccess: () => {
            messageApi.success("Đóng quỹ thành công.");

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

const handleFinish = (
    values: IContributionFormValues
) => {
    if (!contribution) return;

    mutate({
        id: contribution._id,
        body: {
            amount: values.amount,
            note: values.note,
            paidAt: values.paidAt.toISOString(),
        },
    });
};

    return (
        <>
            {contextHolder}

            <Modal
                title="Đóng quỹ"
                open={open}
                onCancel={onCancel}
                footer={null}
                destroyOnHidden
            >
                <Form<IContributionFormValues>
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
                        label="Số tiền"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số tiền",
                            },
                        ]}
                    >
                        <InputNumber<number>
                            style={{ width: "100%" }}
                            min={0}
                            formatter={(value) =>
                                `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    "."
                                )
                            }
                            parser={(value) =>
                                Number(
                                    value?.replace(/\./g, "") || 0
                                )
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ngày đóng"
                        name="paidAt"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày",
                            },
                        ]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ghi chú"
                        name="note"
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
                            style={{ marginRight: 8 }}
                        >
                            Hủy
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPending}
                        >
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}