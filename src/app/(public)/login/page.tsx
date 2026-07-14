"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { login } from "@/src/api/auth";
import Loader from "@/src/components/Loader";

export default function LoginPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            toast.error("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
            return;
        }

        try {
            setLoading(true);

            await login({
                username,
                password,
            });

            await queryClient.invalidateQueries({
                queryKey: ["me"],
            });

            toast.success("Đăng nhập thành công");

            router.replace("/admin");
        } catch (error: unknown) {
            let message = "Đăng nhập thất bại";

            if (
                error &&
                typeof error === "object" &&
                "response" in error
            ) {
                const response = (
                    error as {
                        response?: {
                            data?: {
                                message?: string;
                            };
                        };
                    }
                ).response;

                message =
                    response?.data?.message ?? message;
            }

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-8 text-center text-3xl font-bold">
                    Football Admin
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            placeholder="Enter username"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter password"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-lg cursor-pointer bg-green-800 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <Loader className="h-auto w-auto bg-transparent" />
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}