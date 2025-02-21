import './globals.css'
import { Providers } from '@/app/_provider'
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/sonner';
import { IBM_Plex_Mono } from "next/font/google"

export const metadata = {
    title: 'Cricbet',
    description: 'Prediction market for cricket',
}

const plex = IBM_Plex_Mono({
    subsets: ["latin-ext"],
    weight: ["100", "200", "300", "400", "500", "600", "700"],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            {/*
                <head>
                    <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
                </head>
            */}
            <body
                className={`${plex.className} antialiased bg-gradient-to-tr dark:from-black from-gray-100 to-background min-h-dvh grid grid-rows-[max-content_1fr]`}
            >
                <Providers>
                    <Header />
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    )
}
