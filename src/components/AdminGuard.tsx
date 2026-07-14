"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "../hooks/useMe";
import Loader from "./Loader";

export default function AdminGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const {
        isLoading,
        isError,
    } = useMe();

    useEffect(() => {
        if (!isLoading && isError) {
            router.replace("/login");
        }
    }, [isLoading, isError, router]);

    if (isLoading) {
        return <Loader className="h-[50vh]"/>;
    }

    if (isError) {
        return null;
    }

    return <>{children}</>;
}