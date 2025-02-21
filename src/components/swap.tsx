"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { z } from "zod";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

enum SwapType {
    Buy = "buy",
    Sell = "sell",
}
const swapTabs = [
    { id: SwapType.Buy, title: "Buy", },
    { id: SwapType.Sell, title: "Sell", },
]

const swapSchema = z.string().refine(
    (val) => {
        const regex = /^\d*\.?\d*$/;
        return val === "" || regex.test(val);
    },
    {
        message: "Invalid number format",
    }
);

export const Swap = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <SwapTabs className="hidden lg:block border border-input w-80 max-w-80 min-w-80 h-fit rounded-2xl" />
            <Drawer open={open} onOpenChange={setOpen}>
                <div className="lg:hidden fixed bottom-16 border border-input w-full p-4">
                    <DrawerTrigger asChild>
                        <Button className="w-full">Buy</Button>
                    </DrawerTrigger>
                </div>
                <DrawerContent>
                    <SwapTabs className="w-full h-fit mb-8 p-4" />
                </DrawerContent>
            </Drawer>
        </>
    )
}

Swap.displayName = "Swap"

interface SwapTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> { }
const SwapTabs = ({ className, ...props }: SwapTabsProps) => {
    const [isYes, setIsYes] = useState(true);
    const [value, setValue] = useState<string>("");

    function handleChange(type: SwapType, value: string) {
        const formatValue = type === "buy" ? value.replace("$", "") : value;
        const res = swapSchema.safeParse(formatValue);
        if (res.success) {
            setValue(res.data);
        }
    }

    return (
        <Tabs defaultValue="buy" className={className} {...props}>
            <TabsList className={cn(
                "px-4 pt-4 pb-0 w-full bg-transparent h-auto justify-start border-b-2 border-input rounded-none gap-3",
                "*:px-0 *:pb-2 *:text-base *:rounded-none *:border-b-2 *:border-transparent *:-mb-0.5",
            )}>
                {swapTabs.map((t) => (
                    <TabsTrigger
                        key={t.id}
                        value={t.id}
                        className="data-[state=active]:shadow-none data-[state=active]:border-primary"
                    >
                        {t.title}
                    </TabsTrigger>
                ))}
            </TabsList>
            {swapTabs.map((t) => (
                <TabsContent key={t.id} value={t.id}>
                    <div className="p-4 grid grid-cols-2 gap-x-3 gap-y-6">
                        {["Yes", "No"].map((choice) => (
                            <Button
                                key={choice}
                                className={cn(
                                    "bg-gray-600/50 text-gray-500 hover:opacity-80 hover:bg-gray-600/50",
                                    isYes && choice === "Yes" && "bg-green-500 text-white hover:bg-green-500",
                                    !isYes && choice === "No" && "bg-red-500 text-white hover:bg-red-500",
                                )}
                                onClick={() => setIsYes(choice === "Yes")}
                            >{choice}</Button>
                        ))}
                        <div className="col-span-2 flex gap-2">
                            <label>{t.id === "buy" ? "Amount" : "Shares"}</label>
                            <Input
                                type="text"
                                placeholder={t.id === "buy" ? "$0" : "0"}
                                value={t.id === "buy" ? `${value.length > 0 ? `$${value}` : ""}` : value}
                                onChange={(e) => handleChange(t.id, e.target.value)}
                                className={cn(
                                    "w-full md:text-3xl text-right font-semibold border-none outline-none focus-visible:ring-0"
                                )}
                            />
                        </div>
                        <Button className="col-span-2">Trade</Button>
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    )
}
