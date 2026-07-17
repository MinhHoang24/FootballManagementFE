"use client";

import {
    Button,
    Form,
    InputNumber,
    Select,
    Space,
    Row, Col 
} from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";

import {
    IMatchFormValues,
} from "../types/match";
import {
    isDisableAssist,
    isDisableScorer,
} from "../helpers/match";

interface PlayerOption {
    label: string;
    value: string;
}

interface Props {
    index: number;
    field: {
        key: number;
        name: number;
    };
    form: FormInstance<IMatchFormValues>;
    playerOptions: PlayerOption[];
    remove: (index: number) => void;
}

export default function GoalItem({
    index,
    field,
    form,
    playerOptions,
    remove,
}: Props) {
    const team =
        Form.useWatch(
            ["goals", field.name, "team"],
            form
        ) ?? "OUR";
    const isOpponent = team === "OPPONENT";
    const type =
        Form.useWatch(
            ["goals", field.name, "type"],
            form
        ) ?? "NORMAL";

    return (
        <div className="mb-4 rounded-md border p-4">
            <div className="mb-3 flex items-center justify-between">
                <span className="font-medium">
                    Goal #{index + 1}
                </span>

                <Button
                    danger
                    type="text"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(field.name)}
                />
            </div>

            <Space
                style={{
                    width: "100%",
                    display: "flex",
                }}
                align="start"
            >
                <Form.Item
                    label="Team"
                    name={[field.name, "team"]}
                    style={{ flex: 1 }}
                >
                    <Select
                        options={[
                            {
                                label: "Our Team",
                                value: "OUR",
                            },
                            {
                                label: "Opponent",
                                value: "OPPONENT",
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="Type"
                    name={[field.name, "type"]}
                    style={{ flex: 1 }}
                >
                    <Select
                        options={[
                            {
                                label: "Normal Goal",
                                value: "NORMAL",
                            },
                            {
                                label: "Own Goal",
                                value: "OWN_GOAL",
                            },
                        ]}
                    />
                </Form.Item>
                {isOpponent && (
                    <Form.Item
                        label="Opponent Goals"
                        name={[field.name, "quantity"]}
                        initialValue={1}
                    >
                        <InputNumber
                            min={1}
                            style={{ width: 180 }}
                        />
                    </Form.Item>
                )}
            </Space>
            {!isOpponent && (
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Scorer"
                            name={[field.name, "scorerPlayerId"]}
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                placeholder="Select scorer"
                                options={playerOptions}
                                disabled={isDisableScorer(team, type)}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Assist"
                            name={[field.name, "assistPlayerId"]}
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                placeholder="Select assist"
                                options={playerOptions}
                                disabled={isDisableAssist(team)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            )}
        </div>
    );
}