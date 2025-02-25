'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Glow, GlowArea } from "@/components/glow";
import Link from "next/link";
import { useCricbetProgram } from "@/components/cricbet/cricbet-data-access";

export default function Page() {
    const { accounts } = useCricbetProgram();
    
    // Handle loading state
    if (accounts.isLoading) {
        return (
            <GlowArea size={200}>
                <main className="flex-1 container p-3 sm:p-6">
                    <div className="text-center">Loading markets...</div>
                </main>
            </GlowArea>
        );
    }
    
    // Handle error state
    if (accounts.isError) {
        return (
            <GlowArea size={200}>
                <main className="flex-1 container p-3 sm:p-6">
                    <div className="text-center text-red-500">
                        Error loading markets: {(accounts.error as Error).message}
                    </div>
                </main>
            </GlowArea>
        );
    }

    // Extract market data
    const markets = accounts.data || [];
    
    return (
        <GlowArea size={200}>
            <main className="flex-1 container p-3 sm:p-6">
                <div className="grid gap-2 sm:gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {markets.map((market) => {
                        const marketAccount = market.account;
                        const marketPublicKey = market.publicKey;
                        
                        // Use the correct field names from your market account structure
                        const title = marketAccount.marketName || "Untitled Market";
                        
                        // Since we don't have direct yesPrice/noPrice fields, we'll display totalLiquidity
                        const totalLiquidity = marketAccount.totalLiquidity 
                            ? `${(marketAccount.totalLiquidity.toNumber() / 1_000_000_000).toFixed(2)} SOL` 
                            : "0 SOL";
                        
                        // Display locked/settled status
                        const status = marketAccount.settled 
                            ? "Settled" 
                            : marketAccount.locked 
                                ? "Locked" 
                                : "Active";
                        
                        // Format end time (convert from Unix timestamp to readable date)
                        const endTime = marketAccount.endTime 
                            ? new Date(marketAccount.endTime.toNumber() * 1000).toLocaleDateString() 
                            : "No end date";
                        
                        return (
                            <Link key={marketPublicKey.toString()} href={`/event/${marketPublicKey.toString()}`}>
                                <Glow className="rounded-xl">
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle className="flex items-start justify-between gap-4">
                                                <span>{title}</span>
                                                <span className="text-xs text-muted-foreground">{status}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                                <span>Ends: {endTime}</span>
                                                <span className="text-xs text-muted-foreground">{status}</span>
                                            </div>
                                            <div className="mt-2 text-sm">
                                                <span>Fee: {marketAccount.fee / 100}%</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="grid grid-cols-2 gap-4">
                                            <Button 
                                                variant="outline" 
                                                className="w-full glass-card hover:bg-green-700/20 hover:dark:text-green-300 hover:text-green-900"
                                                disabled={marketAccount.locked || marketAccount.settled}
                                            >
                                                Buy Yes
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                className="w-full glass-card hover:bg-destructive/20 hover:text-destructive"
                                                disabled={marketAccount.locked || marketAccount.settled}
                                            >
                                                Buy No
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Glow>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </GlowArea>
    );
}