"use client";

import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Space } from "antd";
import { ICreateMatchBody, IGoalInput, IMatch, IMatchFormValues } from "../../types/match";
import { createEmptyGoal, getScore } from "../../helpers/match";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getListPlayers } from "../../api/player";
import { IPlayer } from "../../types/player";
import { createMatch, updateMatch } from "../../api/match";
import { useEffect } from "react";
import dayjs from "dayjs";
import {
    PlusOutlined,
} from "@ant-design/icons";
import GoalItem from "./GoalItem";

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

    const goals =
        Form.useWatch("goals", form) ?? [];

    const score = getScore(goals);

    const queryClient = useQueryClient();

    const season = Form.useWatch("season", form);

    const { data: playerData } = useQuery({
        queryKey: ["players-select", season],
        queryFn: () =>
            getListPlayers({
                page: 1,
                limit: 999,
                season
            }),
        enabled: open && !!season,
    });

    const playerOptions =
        playerData?.items.map((player: IPlayer) => ({
            label: `${player.number} - ${player.name}`,
            value: player._id,
        })) ?? [];

    const createMutation = useMutation({
        mutationFn: createMatch,

        onSuccess: () => {
            message.success("Create match successfully");

            queryClient.invalidateQueries({
                queryKey: ["matches"],
            });

            form.resetFields();

            onSuccess();
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

            form.resetFields();

            onSuccess();
            onClose();
        },

        onError: () => {
            message.error("Update failed");
        },
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        if (match) {
            form.setFieldsValue({
                season: match.season,
                opponent: match.opponent,
                matchDate: dayjs(match.matchDate) as never,

                goals: match.goals.map((goal) => ({
                    team: goal.team,
                    type: goal.type,
                    minute: goal.minute,
                    scorerPlayerId:
                        goal.scorerPlayerId?._id ?? null,
                    assistPlayerId:
                        goal.assistPlayerId?._id ?? null,
                })),
            });

            return;
        }

        form.resetFields();

        form.setFieldsValue({
            goals: [createEmptyGoal()],
        });
    }, [open, match, form]);

    const handleFinish = (
        values: IMatchFormValues
    ) => {
        const goals: IGoalInput[] = values.goals.flatMap((goal) => {
            if (goal.team === "OUR") {
                return [goal];
            }

            return Array.from(
                { length: goal.quantity ?? 1 },
                (): IGoalInput => ({
                    team: "OPPONENT",
                    type: goal.type,
                    minute: null,
                    scorerPlayerId: null,
                    assistPlayerId: null,
                })
            );
        });
        const body: ICreateMatchBody = {
            season: values.season,
            opponent: values.opponent,
            matchDate:
                values.matchDate.toISOString(),
            goals,
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

    return (
        <Modal
            open={open}
            title={
                match
                    ? "Update Match"
                    : "Create Match"
            }
            footer={[
                <Button
                    key="cancel" 
                    onClick={() => {
                        form.resetFields();
                        onClose();
                    }}
                >
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    className="!border-green-800 !bg-green-800 hover:!border-green-900 hover:!bg-green-900"
                    onClick={() => form.submit()}
                >
                    {match ? "Update" : "Create"}
                </Button>,
            ]}
            destroyOnHidden
            width={900}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            styles={{
                body: {
                    maxHeight: "calc(100vh - 220px)",
                    overflowY: "auto",
                },
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Space
                    align="start"
                    style={{
                        width: "100%",
                        display: "flex",
                    }}
                >
                <Form.Item
                    label="Season"
                    name="season"
                    style={{ flex: 1 }}
                    rules={[
                        {
                            required: true,
                            message: "Please select season",
                        },
                    ]}
                >
                    <Select
                        placeholder="Select season"
                        options={[
                            {
                                label: "2026",
                                value: 2026,
                            },
                        ]}
                    />
                </Form.Item>

                    <Form.Item
                        label="Match Date"
                        name="matchDate"
                        style={{ flex: 1 }}
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please select match date",
                            },
                        ]}
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            style={{
                                width: "100%",
                            }}
                        />
                    </Form.Item>
                </Space>

                <Form.Item
                    label="Opponent"
                    name="opponent"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please enter opponent",
                        },
                    ]}
                >
                    <Input placeholder="Opponent name" />
                </Form.Item>

                <div className="mb-6 rounded-md border bg-gray-50 px-4 py-3">
                    <div className="text-sm text-gray-500">
                        Score
                    </div>

                    <div className="text-2xl font-bold">
                        {score.our} - {score.opponent}
                    </div>
                </div>

                <Form.List name="goals">
                    {(fields, { add, remove }) => (
                        <>
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-base font-semibold">
                                    Goal Events
                                </span>

                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => add(createEmptyGoal())}
                                >
                                    Add Goal
                                </Button>
                            </div>

                            <div
                                style={{
                                    maxHeight: 400,
                                    overflowY: "auto",
                                    paddingRight: 8,
                                }}
                            >
                                {fields.map((field, index) => (
                                    <GoalItem
                                        key={field.key}
                                        index={index}
                                        field={field}
                                        form={form}
                                        playerOptions={playerOptions}
                                        remove={remove}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
}