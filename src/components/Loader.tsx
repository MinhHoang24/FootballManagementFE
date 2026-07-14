import { cn } from "@/src/lib/utils";
import React from "react";

export default function Loader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex h-full w-full items-center justify-center bg-white/50",
                className
            )}
        >
            <div
                className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-green-800"
                {...props}
            ></div>
        </div>
    )
}