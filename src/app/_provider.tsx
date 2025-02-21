"use client"

import { ThemeProvider } from "next-themes"
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import type { ReactNode } from "react"
import { SolanaProvider } from "@/components/solana/solana-provider"

require("@solana/wallet-adapter-react-ui/styles.css")

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryStreamedHydration>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <SolanaProvider>
                        {children}
                    </SolanaProvider>
                </ThemeProvider>
            </ReactQueryStreamedHydration>
        </QueryClientProvider>
    )
}


