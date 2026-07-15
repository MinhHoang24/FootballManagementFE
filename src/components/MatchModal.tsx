"use client";

import { useEffect } from "react";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    message,
} from "antd";
import dayjs from "dayjs";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createMatch, updateMatch } from "../api/match";
import { getListPlayers } from "../api/player";

import {
    ICreateMatchBody,
    IMatch,
    IMatchFormValues
} from "../types/match";

import { IPlayer } from "../types/player";

interface Props {
    open: boolean;
    match?: IMatch;
    onClose: () => void;
    onSuccess: () => void;
}

export default function MatchModal({
    open,
    match,
    onClose,
    onSuccess,
}: Props) {
    const [form] = Form.useForm<IMatchFormValues>();
    const ourScore = Form.useWatch(["score", "our"], form) ?? 0;
    const goals = Form.useWatch("goals", form) ?? [];

    const queryClient = useQueryClient();

    const { data: playerData } = useQuery({
        queryKey: ["players-select"],
        queryFn: () =>
            getListPlayers({
                page: 1,
                limit: 999,
            }),
        enabled: open,
    });

    const createMutation = useMutation({
        mutationFn: createMatch,

        onSuccess: () => {
            message.success("Create match successfully");

            queryClient.invalidateQueries({
                queryKey: ["matches"],
            });

            onSuccess();

            form.resetFields();

            onClose();
        },

        onError: () => {
            message.error("Create failed");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            body,
        }: {
            id: string;
            body: ICreateMatchBody;
        }) => updateMatch(id, body),

        onSuccess: () => {
            message.success("Update match successfully");

            queryClient.invalidateQueries({
                queryKey: ["matches"],
            });

            onSuccess();

            form.resetFields();

            onClose();
        },

        onError: () => {
            message.error("Update failed");
        },
    });

    useEffect(() => {
        if (!open) return;

        if (match) {
            form.setFieldsValue({
                season: match.season,
                opponent: match.opponent,
                matchDate: dayjs(match.matchDate) as never,

                score: {
                    our: match.score.our,
                    opponent: match.score.opponent,
                },

                goals: match.goals.map((goal) => ({
                    scorerPlayerId:
                        goal.scorerPlayerId?._id ?? null,

                    assistPlayerId:
                        goal.assistPlayerId?._id ?? null,
                })),
            });
        } else {
            form.resetFields();

            form.setFieldsValue({
                goals: [],
            });
        }
    }, [open, match, form]);

    const playerOptions =
        playerData?.items.map((player: IPlayer) => ({
            label: `${player.number} - ${player.name}`,
            value: player._id,
        })) ?? [];

    const handleFinish = (
        values: IMatchFormValues
    ) => {
        const body: ICreateMatchBody = {
            ...values,
            matchDate: values.matchDate.toISOString(),
        };

        if (match) {
            updateMutation.mutate({
                id: match._id,
                body,
            });

            return;
        }

        createMutation.mutate(body);
    };

    const loading =
        createMutation.isPending ||
        updateMutation.isPending;

    useEffect(() => {
        if (goals.length > ourScore) {
            form.setFieldValue(
                "goals",
                goals.slice(0, ourScore)
            );
        }
    }, [ourScore, goals, form]);

    return (
        <Modal
            open={open}
            title={match ? "Update Match" : "Create Match"}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            footer={null}
            destroyOnHidden
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Space
                    style={{
                        width: "100%",
                        display: "flex",
                    }}
                    align="start"
                >
                    <Form.Item
                        label="Season"
                        name="season"
                        rules={[
                            {
                                required: true,
                                message: "Please enter season",
                            },
                        ]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            min={2020}
                            max={2100}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Date"
                        name="matchDate"
                        rules={[
                            {
                                required: true,
                                message: "Please select date",
                            },
                        ]}
                        style={{ flex: 1 }}
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </Space>

                <Form.Item
                    label="Opponent"
                    name="opponent"
                    rules={[
                        {
                            required: true,
                            message: "Please enter opponent",
                        },
                    ]}
                >
                    <Input placeholder="Opponent name" />
                </Form.Item>

                <Space
                    style={{
                        width: "100%",
                        display: "flex",
                    }}
                >
                    <Form.Item
                        label="Our Score"
                        name={["score", "our"]}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Opponent Score"
                        name={["score", "opponent"]}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </Space>

                <Form.List name="goals">
                    {(fields, { add, remove }) => (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold text-base">
                                    Goals
                                </span>

                                <Button
                                    icon={<PlusOutlined />}
                                    disabled={goals.length >= ourScore}
                                    onClick={() =>
                                        add({
                                            scorerPlayerId: null,
                                            assistPlayerId: null,
                                        })
                                    }
                                >
                                    Add Goal
                                </Button>
                            </div>

                            {fields.map((field, index) => (
                                <div
                                    key={field.key}
                                    className="flex items-start gap-3 mb-3"
                                >
                                    <Form.Item
                                        label={index === 0 ? "Scorer" : ""}
                                        name={[field.name, "scorerPlayerId"]}
                                        className="flex-1"
                                    >
                                        <Select
                                            allowClear
                                            showSearch
                                            optionFilterProp="label"
                                            placeholder="Select scorer"
                                            options={playerOptions}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label={index === 0 ? "Assist" : ""}
                                        name={[field.name, "assistPlayerId"]}
                                        className="flex-1"
                                    >
                                        <Select
                                            allowClear
                                            showSearch
                                            optionFilterProp="label"
                                            placeholder="Select assist"
                                            options={playerOptions}
                                        />
                                    </Form.Item>

                                    <Button
                                        danger
                                        icon={<MinusCircleOutlined />}
                                        onClick={() => remove(field.name)}
                                    />
                                </div>
                            ))}
                        </>
                    )}
                </Form.List>

                <div className="flex justify-end gap-2 mt-6">
                    <Button
                        onClick={() => {
                            form.resetFields();
                            onClose();
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="!bg-green-800 hover:!bg-green-900 !border-green-800"
                    >
                        {match ? "Update" : "Create"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}