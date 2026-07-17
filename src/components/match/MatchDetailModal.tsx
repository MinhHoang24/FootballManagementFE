"use client";

import dayjs from "dayjs";
import {
    Descriptions,
    Empty,
    Modal,
    Spin,
    Tag,
    Timeline,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { getMatchDetail } from "../../api/match";

interface Props {
    open: boolean;
    matchId?: string;
    onClose: () => void;
}

export default function MatchDetailModal({
    open,
    matchId,
    onClose,
}: Props) {
    const { data, isLoading } = useQuery({
        queryKey: ["match-detail", matchId],
        queryFn: () => getMatchDetail(matchId!),
        enabled: open && !!matchId,
    });

    const match = data?.data;

    return (
        <Modal
            open={open}
            title="Match Detail"
            footer={null}
            width={800}
            destroyOnHidden
            onCancel={onClose}
        >
            {isLoading ? (
                <div className="py-20 text-center">
                    <Spin />
                </div>
            ) : !match ? (
                <Empty />
            ) : (
                <>
                    <Descriptions
                        bordered
                        column={2}
                        size="small"
                        className="mb-6"
                    >
                        <Descriptions.Item label="Season">
                            {match.season}
                        </Descriptions.Item>

                        <Descriptions.Item label="Date">
                            {dayjs(match.matchDate).format(
                                "DD/MM/YYYY"
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Opponent">
                            {match.opponent}
                        </Descriptions.Item>

                        <Descriptions.Item label="Score">
                            <span className="text-lg font-semibold">
                                {match.score.our} -{" "}
                                {match.score.opponent}
                            </span>
                        </Descriptions.Item>
                    </Descriptions>

                    <h3 className="mb-4 text-lg font-semibold">
                        Goal Events
                    </h3>

                    {match.goals.length === 0 ? (
                        <Empty
                            description="No goals"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <Timeline
                            items={match.goals
                                .slice()
                                .sort(
                                    (a, b) =>
                                        (a.minute ?? 0) -
                                        (b.minute ?? 0)
                                )
                                .map((goal) => ({
                                    children: (
                                        <div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="font-semibold">
                                                    {goal.minute ?? "-"}
                                                </span>

                                                <Tag
                                                    color={
                                                        goal.team ===
                                                        "OUR"
                                                            ? "green"
                                                            : "red"
                                                    }
                                                >
                                                    {goal.team ===
                                                    "OUR"
                                                        ? "Our Team"
                                                        : "Opponent"}
                                                </Tag>

                                                {goal.type ===
                                                    "OWN_GOAL" && (
                                                    <Tag color="orange">
                                                        Own Goal
                                                    </Tag>
                                                )}
                                            </div>

                                            {goal.team ===
                                            "OUR" ? (
                                                <div className="space-y-1">
                                                    <div>
                                                        <strong>
                                                            Scorer:
                                                        </strong>{" "}
                                                        {goal
                                                            .scorerPlayerId
                                                            ? `${goal.scorerPlayerId.number} - ${goal.scorerPlayerId.name}`
                                                            : "-"}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            Assist:
                                                        </strong>{" "}
                                                        {goal
                                                            .assistPlayerId
                                                            ? `${goal.assistPlayerId.number} - ${goal.assistPlayerId.name}`
                                                            : "-"}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    Goal by
                                                    opponent
                                                </div>
                                            )}
                                        </div>
                                    ),
                                }))}
                        />
                    )}
                </>
            )}
        </Modal>
    );
}