"use client";

import { Avatar, Card, Descriptions, Drawer, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getPlayerDetail } from "../api/player";

interface Props {
    open: boolean;
    playerId?: string;
    onClose(): void;
}

export default function PlayerDetailDrawer({
    open,
    playerId,
    onClose,
}: Props) {
    const { data, isLoading } = useQuery({
        queryKey: ["player-detail", playerId],
        queryFn: () => getPlayerDetail(playerId!),
        enabled: !!playerId && open,
    });

    const player = data?.data;

    return (
        <Drawer
            size={500}
            open={open}
            onClose={onClose}
            title="Player Information"
        >
            {isLoading ? (
                <Spin />
            ) : (
                <Card>

                    <div className="mb-8 flex justify-center">

                        <Avatar
                            size={140}
                            src={player?.avatar || undefined}
                            icon={<UserOutlined />}
                        />

                    </div>

                    <Descriptions
                        bordered
                        column={1}
                    >
                        <Descriptions.Item label="Name">
                            {player?.name}
                        </Descriptions.Item>

                        <Descriptions.Item label="Number">
                            {player?.number}
                        </Descriptions.Item>

                        <Descriptions.Item label="Position">
                            {player?.position}
                        </Descriptions.Item>

                        <Descriptions.Item label="Shirt Size">
                            {player?.shirtSize}
                        </Descriptions.Item>

                        <Descriptions.Item label="Created">
                            {new Date(
                                player?.createdAt
                            ).toLocaleDateString()}
                        </Descriptions.Item>

                    </Descriptions>

                </Card>
            )}
        </Drawer>
    );
}