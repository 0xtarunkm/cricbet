'use client'

import { Chart } from "@/components/chart";
import { Swap } from "@/components/swap";
import { useRouter } from "next/navigation";
import { useCricbetProgramAccount } from "@/components/cricbet/cricbet-data-access";
import { PublicKey } from "@solana/web3.js";

export default function Page({
    params,
}: {
    params: { id: string }
}) {
    const router = useRouter();
    const id = params.id;
    
    let marketPublicKey: PublicKey;
    try {
        marketPublicKey = new PublicKey(id);
    } catch (error) {
        router.push("/");
        return null;
    }
    
    const { accountQuery } = useCricbetProgramAccount({ account: marketPublicKey });
    
    if (accountQuery.isLoading) {
        return <div className="p-8 text-center">Loading market data...</div>;
    }
    
    if (accountQuery.isError) {
        return (
            <div className="p-8 text-center text-red-500">
                Error loading market: {(accountQuery.error as Error).message}
            </div>
        );
    }
    
    const marketAccount = accountQuery.data;
    
    if (!marketAccount) {
        return <div className="p-8 text-center">Market not found</div>;
    }

    return (
        <div className="relative h-full max-w-screen-xl mx-auto w-full p-8 grid grid-cols-1 lg:grid-flow-col pb-16">
            <div>
                <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold">{marketAccount.marketName}</h1>
                <Chart />
            </div>
            <Swap market={marketPublicKey} mintYes={marketAccount.mintYes} mintNo={marketAccount.mintNo} />
        </div>
    )
}
