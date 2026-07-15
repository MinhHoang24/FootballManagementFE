import "antd/dist/reset.css";
import "./globals.css";

import { cn } from "../lib/utils";
import TanstackQueryProvider from "../contexts/TansrackQuery";
import { Toaster } from "react-hot-toast";

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html 
            lang={"en"}
            suppressHydrationWarning
            className={cn(`scroll-smooth`)}
            translate="yes"
            data-scroll-behavior="smooth"
        >
            <body>
                <TanstackQueryProvider>
                    {children}
                </TanstackQueryProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                    }}
                />
            </body>
        </html>
    )
}