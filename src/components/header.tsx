import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { WalletConnect } from "@/components/wallet-connect"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ToggleTheme from "@/components/ui/toggle-theme";

export const Header = () => {
    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container px-4 md:px-8 flex h-16 items-center gap-5">
                    <Link href="/" className="flex items-center gap-2 font-bold">
                        <Image
                            src="/placeholder.svg"
                            alt="CricketPredict Logo"
                            width={32}
                            height={32}
                            className="rounded bg-primary/10 p-1"
                        />
                        CricketPredict
                    </Link>
                    <div className="relative flex-1 hidden  lg:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input className="w-full pl-10 glass-card hover:dark:bg-gray-800/20 hover:border-gray-300 hover:bg-gray-100/20" placeholder="Search markets..." />
                    </div>
                    <nav className="hidden lg:flex items-center gap-4">
                        <Link href="/markets" className="hover:text-primary transition-colors">
                            Markets
                        </Link>
                        <Link href="/portfolio" className="hover:text-primary transition-colors">
                            Portfolio
                        </Link>
                        <Link href="/activity" className="hover:text-primary transition-colors">
                            Activity
                        </Link>
                        <ToggleTheme />
                        <WalletConnect />
                    </nav>
                    <nav className="lg:hidden flex flex-1 justify-end items-center gap-4">
                        <ToggleTheme />
                        <WalletConnect text="Connect" />
                    </nav>
                </div>
                <div className="container px-4 md:px-8">
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="w-full justify-start rounded-none h-12 bg-transparent">
                            <TabsTrigger
                                value="all"
                                className="rounded-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                            >
                                All
                            </TabsTrigger>
                            <TabsTrigger
                                value="ipl"
                                className="rounded-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                            >
                                IPL
                            </TabsTrigger>
                            <TabsTrigger
                                value="international"
                                className="rounded-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                            >
                                International
                            </TabsTrigger>
                            <TabsTrigger
                                value="t20"
                                className="rounded-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                            >
                                T20
                            </TabsTrigger>
                            <TabsTrigger
                                value="test"
                                className="rounded-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                            >
                                Test
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </header>
            <nav className="lg:hidden flex items-center gap-2 justify-between fixed bottom-0 w-full z-10 px-6 py-3 dark:bg-black bg-white">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                    <Input className="w-full pl-10 glass-card hover:dark:bg-gray-800/20 hover:border-gray-300 hover:bg-gray-100/20 text-sm" placeholder="Search markets..." />
                </div>
                <Link href="/markets" className="hover:text-primary transition-colors text-xs">
                    Markets
                </Link>
                <Link href="/portfolio" className="hover:text-primary transition-colors text-xs">
                    Portfolio
                </Link>
                <Link href="/activity" className="hover:text-primary transition-colors text-xs">
                    Activity
                </Link>
            </nav>
        </>
    )
}

Header.displayName = "Header";
