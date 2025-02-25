"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import anchor from "@coral-xyz/anchor";
import { z } from "zod";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { PublicKey } from "@solana/web3.js";
import { useCricbetSwap } from "@/components/cricbet/cricbet-data-access";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-hot-toast";
import { useConnection } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useQuery } from "@tanstack/react-query";

const swapSchema = z.string().refine(
    (val) => {
        const regex = /^\d*\.?\d*$/;
        return val === "" || regex.test(val);
    },
    {
        message: "Invalid number format",
    }
);

export const Swap = ({ 
    market, 
    mintYes, 
    mintNo 
}: { 
    market: PublicKey;
    mintYes: PublicKey;
    mintNo: PublicKey;
}) => {
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const handleMarketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // This is a placeholder - you would replace this with your actual market change logic
        // For example, you might fetch the current price from an API
        setPrice(parseFloat(e.target.value) * 0.5); // Example calculation
    };

    const calculatePrice = () => {
        // This is a placeholder - you would replace this with your actual price calculation logic
        // For example, you might fetch the current price from an API
        return parseFloat(amount) * 0.5; // Example calculation
    };

    const handleBuy = async () => {
        // Reset states
        setError(null);
        setSuccess(false);
        setIsLoading(true);
        
        try {
            // Calculate the current price
            const currentPrice = calculatePrice();
            
            // Prepare the trade data
            const tradeData = {
                market: market.toString(),
                price: currentPrice,
                volume: parseFloat(amount)
            };
            
            // Send the trade data to your API
            const response = await fetch('/api/trade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tradeData),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to record trade');
            }
            
            // Trade was successful
            setSuccess(true);
            
            // Optional: Reset the form or show a success message
            setAmount("");
            
        } catch (error) {
            console.error('Error during trade:', error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SwapPanel 
                className="hidden lg:block border border-input w-96 max-w-96 min-w-96 h-fit rounded-2xl p-4" 
                market={market}
                mintYes={mintYes}
                mintNo={mintNo}
            />
            <Drawer open={open} onOpenChange={setOpen}>
                <div className="lg:hidden fixed bottom-16 border border-input w-full p-4">
                    <DrawerTrigger asChild>
                        <Button className="w-full">Buy Position</Button>
                    </DrawerTrigger>
                </div>
                <DrawerContent>
                    <SwapPanel 
                        className="w-full h-fit mb-8 p-4" 
                        market={market}
                        mintYes={mintYes}
                        mintNo={mintNo}
                    />
                </DrawerContent>
            </Drawer>
        </>
    )
}

Swap.displayName = "Swap"

interface SwapPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    market: PublicKey;
    mintYes: PublicKey;
    mintNo: PublicKey;
}

const SwapPanel = ({ className, market, mintYes, mintNo, ...props }: SwapPanelProps) => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const { swapMutation } = useCricbetSwap();
    const [isYes, setIsYes] = useState(true);
    const [value, setValue] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    
    const mintUsdc = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // Mainnet USDC
    
    const vaultYes = getAssociatedTokenAddressSync(mintYes, market, true);
    const vaultNo = getAssociatedTokenAddressSync(mintNo, market, true);
    
    const balancesQuery = useQuery({
        queryKey: ['market-balances', market.toString()],
        queryFn: async () => {
            try {
                const vaultYesBalance = await connection.getTokenAccountBalance(vaultYes);
                const vaultNoBalance = await connection.getTokenAccountBalance(vaultNo);
                
                const yesAmount = vaultYesBalance.value.uiAmount || 0;
                const noAmount = vaultNoBalance.value.uiAmount || 0;
                
                const totalLiquidity = yesAmount + noAmount;
                const yesPrice = totalLiquidity > 0 ? yesAmount / totalLiquidity : 0.5;
                const noPrice = totalLiquidity > 0 ? noAmount / totalLiquidity : 0.5;
                
                return {
                    yesAmount,
                    noAmount,
                    yesPrice,
                    noPrice,
                    totalLiquidity
                };
            } catch (error) {
                console.error("Error fetching balances:", error);
                return {
                    yesAmount: 0,
                    noAmount: 0,
                    yesPrice: 0.5,
                    noPrice: 0.5,
                    totalLiquidity: 0
                };
            }
        },
        refetchInterval: 30000 // Refetch every 30 seconds
    });
    
    function handleChange(value: string) {
        const formatValue = value.replace("$", "");
        const res = swapSchema.safeParse(formatValue);
        if (res.success) {
            setValue(res.data);
        }
    }
    
    async function handleSwap() {
        if (!publicKey) {
            toast.error("Please connect your wallet");
            return;
        }
        
        if (!value || parseFloat(value) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        
        try {
            // Convert value to lamports (multiply by 1_000_000 for USDC)
            const amountLamports = Math.floor(parseFloat(value) * 1_000_000); 
            
            await swapMutation.mutateAsync({
                market,
                mintYes,
                mintNo,
                mintUsdc,
                isBuying: true, // Always buying in this simplified interface
                amountIn: amountLamports,
                isYes,
                minOut: Math.floor(amountLamports * 0.97) // 3% slippage
            });
            
            // After successful swap, record the trade in the database
            try {
                // Get current price based on position
                const currentPrice = isYes 
                    ? balancesQuery.data?.yesPrice || 0.5
                    : balancesQuery.data?.noPrice || 0.5;
                    
                // Prepare trade data
                const tradeData = {
                    market: market.toString().includes('ind_wins') ? 'ind_wins' : 'vk_century',
                    price: currentPrice,
                    volume: parseFloat(value)
                };
                
                // Call the trade API
                await fetch('/api/trade', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tradeData),
                });
                
            } catch (apiError) {
                console.error("Failed to record trade in database:", apiError);
                // Don't show error to user as the swap itself was successful
            }
            
            // Reset form and refetch balances on success
            setValue("");
            balancesQuery.refetch();
            
        } catch (error) {
            console.error("Swap error:", error);
            toast.error("Transaction failed: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    }

    // Get current price based on selected position
    const currentPrice = isYes 
        ? balancesQuery.data?.yesPrice || 0.5
        : balancesQuery.data?.noPrice || 0.5;
    
    const calculatePrice = () => {
        return parseFloat(amount) * (isYes ? 
            balancesQuery.data?.yesPrice || 0.5 : 
            balancesQuery.data?.noPrice || 0.5);
    };

    return (
        <div className={cn("bg-card/40 backdrop-blur-sm rounded-2xl", className)} {...props}>    
            <div className="">
                {/* Position Selection */}
                <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Select Position</label>
                    <div className="grid grid-cols-2 gap-3">
                        {["Yes", "No"].map((choice) => (
                            <button
                                key={choice}
                                className={cn(
                                    "h-12 font-medium transition-all rounded-md border",
                                    "focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0",
                                    isYes && choice === "Yes" ? "bg-green-500/20 text-green-500 border-green-500 hover:bg-green-500/30" : 
                                    !isYes && choice === "No" ? "bg-red-500/20 text-red-500 border-red-500 hover:bg-red-500/30" :
                                    "bg-background hover:bg-accent border-input text-foreground"
                                )}
                                onClick={() => setIsYes(choice === "Yes")}
                            >{choice}</button>
                        ))}
                    </div>
                </div>
                
                {/* Current Price */}
                <div className="bg-background/50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Current Price:</span>
                        <span className="font-medium text-primary">
                            {(currentPrice * 100).toFixed(2)}% (~${currentPrice.toFixed(3)} USDC)
                        </span>
                    </div>
                </div>
                
                {/* Amount Input */}
                <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Amount (USDC)</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="0"
                            value={value.length > 0 ? `${value}` : ""}
                            onChange={(e) => handleChange(e.target.value)}
                            className="w-full text-xl h-14 text-right pr-14 font-medium bg-background/50 rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                            USDC
                        </div>
                    </div>
                </div>
                
                {/* Market Data */}
                {balancesQuery.isLoading ? (
                    <div className="flex justify-center py-2">
                        <div className="animate-pulse text-sm text-muted-foreground">Loading market data...</div>
                    </div>
                ) : balancesQuery.isError ? (
                    <div className="text-center text-sm text-destructive py-2">Failed to load market data</div>
                ) : (
                    <div className="bg-background/50 rounded-lg p-3">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Liquidity:</span>
                                <span>{balancesQuery.data?.totalLiquidity.toFixed(2) || "0.00"} tokens</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Yes Price:</span>
                                <span className="text-green-500">
                                    {((balancesQuery.data?.yesPrice || 0.5) * 100).toFixed(2)}% 
                                    (${(balancesQuery.data?.yesPrice || 0.5).toFixed(3)})
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">No Price:</span>
                                <span className="text-red-500">
                                    {((balancesQuery.data?.noPrice || 0.5) * 100).toFixed(2)}% 
                                    (${(balancesQuery.data?.noPrice || 0.5).toFixed(3)})
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Submit Button */}
                <button 
                    className={cn(
                        "w-full h-12 text-base font-medium rounded-md",
                        "text-white bg-blue-600 hover:bg-blue-700",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        "transition-colors duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    onClick={handleSwap}
                    disabled={swapMutation.isPending || !value || parseFloat(value) <= 0}
                >
                    {swapMutation.isPending ? 
                        "Processing..." : 
                        `Buy ${isYes ? "Yes" : "No"} Position`
                    }
                </button>
            </div>
        </div>
    )
}
