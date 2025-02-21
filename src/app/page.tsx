import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Glow, GlowArea } from "@/components/glow";
import { dummyPredictions } from "@/lib/demo";
import Link from "next/link";

export default function Page() {
    return (
        <GlowArea size={200}>
            <main className="flex-1 container p-3 sm:p-6">
                <div className="grid gap-2 sm:gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {dummyPredictions.map((d) => (
                        <Link key={d.id} href={`/event/${d.id}`}>
                            <Glow className="rounded-xl">
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle className="flex items-start justify-between gap-4">
                                            <span>{d.title}</span>
                                            <span className="text-xl font-bold text-primary">{d.percentage}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                                            <span>{d.volume}</span>
                                            <span className="text-primary">{d.percentageChange}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="grid grid-cols-2 gap-4">
                                        <Button variant="outline" className="w-full glass-card hover:bg-green-700/20 hover:dark:text-green-300 hover:text-green-900">
                                            Buy Yes
                                        </Button>
                                        <Button variant="outline" className="w-full glass-card hover:bg-destructive/20 hover:text-destructive">
                                            Buy No
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Glow>
                        </Link>
                    ))}
                </div>
            </main>
        </GlowArea>
    )
}

