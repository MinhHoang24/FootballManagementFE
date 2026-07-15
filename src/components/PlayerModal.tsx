"use client";

import { useEffect } from "react";
import {
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    message,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createPlayer, updatePlayer } from "../api/player";
import { IPlayer, IPlayerUpdateBody } from "../types/player";

interface Props {
    open: boolean;
    player?: IPlayer;
    onClose(): void;
    onSuccess(): void;
}

const positionOptions = [
    { label: "GK", value: "GK" },
    { label: "CB", value: "CB" },
    { label: "CM", value: "CM" },
    { label: "ST", value: "ST" },
];

const shirtOptions = [
    { label: "S", value: "S" },
    { label: "M", value: "M" },
    { label: "L", value: "L" },
    { label: "XL", value: "XL" },
    { label: "XXL", value: "XXL" },
];

export default function PlayerModal({
    open,
    player,
    onClose,
    onSuccess,
}: Props) {
    const [form] = Form.useForm<IPlayerUpdateBody>();

    useEffect(() => {
        if (!open) return;

        if (player) {
            form.setFieldsValue({
                name: player.name,
                number: player.number,
                position: player.position,
                shirtSize: player.shirtSize,
                avatar: player.avatar,
            });
        } else {
            form.resetFields();
        }
    }, [open, player, form]);

    const mutation = useMutation({
        mutationFn: async (values: IPlayerUpdateBody) => {
            if (player) {
                return updatePlayer(player._id, values);
            }

            return createPlayer(values);
        },

        onSuccess: () => {
            message.success(
                player
                    ? "Update player successfully"
                    : "Create player successfully"
            );

            onSuccess();
            onClose();
        },

        onError: (err: AxiosError<{ message: string }>) => {
            message.error(
                err.response?.data?.message ?? "Something went wrong"
            );
        },
    });

    const handleSubmit = async () => {
        const values = await form.validateFields();

        mutation.mutate(values);
    };

    return (
        <Modal
            open={open}
            destroyOnHidden
            title={player ? "Update Player" : "Create Player"}
            okText={player ? "Update" : "Create"}
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={mutation.isPending}
            okButtonProps={{
                className:
                    "!bg-green-800 hover:!bg-green-900 !border-green-800 hover:!border-green-900 !text-white",
            }}
        >
            <Form
                layout="vertical"
                form={form}
            >
                <Form.Item
                    name="name"
                    label="Player Name"
                    rules={[
                        {
                            required: true,
                            message: "Please enter player name",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="number"
                    label="Number"
                    rules={[
                        {
                            required: true,
                            message: "Please enter number",
                        },
                    ]}
                >
                    <InputNumber
                        className="w-full"
                        min={1}
                    />
                </Form.Item>

                <Form.Item
                    name="position"
                    label="Position"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select options={positionOptions} />
                </Form.Item>

                <Form.Item
                    name="shirtSize"
                    label="Shirt Size"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select options={shirtOptions} />
                </Form.Item>

                <Form.Item
                    name="avatar"
                    label="Avatar"
                >
                    <Input placeholder="Avatar url" />
                </Form.Item>
            </Form>
        </Modal>
    );
}