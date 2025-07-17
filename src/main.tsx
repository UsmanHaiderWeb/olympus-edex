import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
const App = lazy(() => import('./App.tsx'));
const TokenListing = lazy(() => import('./pages/TokenListing.tsx'));


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        // children: [
        // ]
    },
    {
        path: '/token-listing',
        element: <TokenListing />,
    },
    {
        path: '/app2',
        element: <App2 />,
    },
])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <main>
                <Suspense fallback={<div></div>}>
                    <RouterProvider router={router} />
                </Suspense>
            </main>
        </QueryClientProvider>
    </StrictMode>,
)

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, HistogramSeries, type Time, type CandlestickData } from 'lightweight-charts';
import { Link } from "react-router-dom"


function App2() {
    // const { register, handleSubmit } = useForm()

    return (
        <div className="px-4 py-10 max-w-[1200px] mx-auto text-center space-y-6">
            <header>
                <h1 className="text-4xl font-bold underline">Olympus eDEX</h1>
                <div className="text-7xl font-bold my-2">Ω</div>
            </header>

            <div className="flex justify-between md:items-end md:flex-row flex-col gap-2">
                <div className="space-y-2">
                    <Label className="font-bold text-lg underline">Olympus eDEX</Label>
                    <div className="space-y-1">
                        <Label>Market Pair:</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Pre Omega (Ω) / Pre Alpha (α)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="omega-alpha">Pre Omega (Ω) / Pre Alpha (α)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-end gap-2 md:self-start self-end">
                    <Button variant="outline">Connect Wallet</Button>
                    <Link to='/token-listing'>
                        <Button variant="default">List Token</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <Card className="text-left">
                    <CardContent className="px-4 space-y-3">
                        <div className="text-lg font-bold">Actual Price: $0.00</div>
                        <CandleChart />
                        <div>
                            <div className="text-sm">24h Volume: $0</div>
                            <div className="text-sm">Sentiment: Neutral</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 space-y-3">
                        <Tabs defaultValue="chart">
                            <TabsList>
                                <TabsTrigger value="chart">Chart Price</TabsTrigger>
                                <TabsTrigger value="limit">Limit Order</TabsTrigger>
                            </TabsList>

                            <TabsContent value="chart" className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Buy" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="buy">Buy</SelectItem>
                                            <SelectItem value="sell">Sell</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input placeholder="Chart price auto" />
                                    <Input placeholder="Amount" />
                                </div>
                                <div className="flex gap-2">
                                    <Button>Approve</Button>
                                    <Button>Deposit</Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="limit" className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Buy" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="buy">Buy</SelectItem>
                                            <SelectItem value="sell">Sell</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input placeholder="Set limit price" />
                                    <Input placeholder="Amount" />
                                </div>
                                <div className="flex gap-2">
                                    <Button>Approve</Button>
                                    <Button>Deposit</Button>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <Separator className="my-6" />

                        <div className="text-left space-y-3 text-sm">
                            <h4 className="font-bold text-lg underline">Project Overview:</h4>
                            <div className="grid grid-cols-2 text-left space-y-1 text-sm">
                                <div className="flex gap-5 items-center">Base Token Contract: <Button size="sm" variant="outline">Copy <Copy /></Button></div>
                                <div className="flex gap-5 items-center">Escrow Contract: <Button size="sm" variant="outline">Copy <Copy /></Button></div>
                                <div className="flex gap-5 items-center">Quote Token Contract: <Button size="sm" variant="outline">Copy <Copy /></Button></div>
                                <div className="flex items-center">Base Token Supply: --</div>
                                <div className="flex items-center h-8">Quote Token Supply: --</div>
                                <div className="flex items-center h-8">Website: <a href="https://omeganetwork.co" className="text-blue-500 underline" target="_blank" rel="noreferrer">omeganetwork.co</a></div>
                                <div className="flex items-center h-8">Whitepaper: <a href="#" className="text-blue-500 underline">GitBook</a></div>
                                <div className="flex items-center h-8">Discord: <span className="text-muted">Not yet provided</span></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4 space-y-2">
                    <h2 className="font-bold text-lg">Match Orders</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input placeholder="Enter Buy Order ID" />
                        <Input placeholder="Enter Sell Order ID" />
                    </div>
                    <Button className="mt-2">Match Orders</Button>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 space-y-4">
                    <h2 className="font-bold text-lg">Order Book</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Buy Orders Table */}
                        <div>
                            <h3 className="font-semibold mb-2">Buy Orders</h3>
                            <div className="rounded-md border">
                                <Table className="w-full text-sm">
                                    <TableHeader className="bg-muted">
                                        <TableRow>
                                            <TableHead className="px-3 text-left font-medium">ID</TableHead>
                                            <TableHead className="px-3 text-left font-medium">Price</TableHead>
                                            <TableHead className="px-3 text-left font-medium">Amount</TableHead>
                                            <TableHead className="px-3 text-left font-medium">Total (USDT)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Example row, replace with dynamic data as needed */}
                                        <TableRow>
                                            <TableCell className="text-left px-3">--</TableCell>
                                            <TableCell className="text-left px-3">--</TableCell>
                                            <TableCell className="text-left px-3">--</TableCell>
                                            <TableCell className="text-left px-3">--</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        {/* Sell Orders Table */}
                        <div>
                            <h3 className="font-semibold mb-2">Sell Orders</h3>
                            <div className="rounded-md border">
                                <Table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <TableRow>
                                            <TableHead className="px-3 text-left font-medium">ID</TableHead>
                                            <TableHead className="px-3 text-left font-medium">Price</TableHead>
                                            <TableHead className="px-3 text-left font-medium">Amount</TableHead>
                                            <TableHead className="px-3 text-left font-medium">Total (USDT)</TableHead>
                                        </TableRow>
                                    </thead>
                                    <TableBody>
                                        {/* Example row, replace with dynamic data as needed */}
                                        <TableRow>
                                            <TableCell className="text-left px-3">--</TableCell>
                                            <TableCell className="text-left px-3">--</TableCell>
                                            <TableCell className="text-left px-3">--</TableCell>
                                            <TableCell className="text-left px-3">--</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    <div className="h-60 text-center text-sm text-muted-foreground py-8 flex items-center justify-center">
                        Market Depth (Chart/Graph Placeholder)
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


// CandleChart.jsx
function CandleChart() {
    const chartContainer = useRef<HTMLDivElement>(null);
    const candles: CandlestickData<Time>[] = Array.from({ length: 50 }, (_, index) => {
        const baseDate = new Date('2024-01-01');
        baseDate.setDate(baseDate.getDate() + index);
        const time = baseDate.toISOString().split('T')[0];

        const basePrice = 2440 + (Math.random() - 0.5) * 100;
        const volatility = 20;

        return {
            time: time as Time,
            open: basePrice + (Math.random() - 0.5) * volatility,
            high: basePrice + Math.random() * volatility + 10,
            low: basePrice - Math.random() * volatility - 10,
            close: basePrice + (Math.random() - 0.5) * volatility,
        };
    });

    useEffect(() => {
        const chart = createChart(chartContainer.current!, {
            layout: {
                background: { color: "#0f0f0f" },
                textColor: "#d1d1d1",
                panes: {
                    separatorColor: "#2B2B43",
                    separatorHoverColor: "#44606f",
                    enableResize: true,
                },
            },
            grid: {
                vertLines: { color: "#2B2B43" },
                horzLines: { color: "#2B2B43" },
            },
            width: chartContainer.current!.clientWidth,
            height: 360,
            crosshair: { mode: 0 },
            timeScale: { timeVisible: true, secondsVisible: false, borderColor: "#485c7b" },
            rightPriceScale: { borderColor: "#485c7b" },
        });

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#0ecb81",
            downColor: "#ff4976",
            borderUpColor: "#0ecb81",
            borderDownColor: "#ff4976",
            wickUpColor: "#0ecb81",
            wickDownColor: "#ff4976",
        }, 0);

        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: { type: "volume" },
            priceScaleId: "",
        }, 1);

        // Optional: tweak pane sizes
        chart.panes()[0].setHeight(0.75);
        chart.panes()[1].setHeight(0.25);

        // Sample candlestick + volume data
        const volumes = candles.map(c => ({
            time: c.time,
            value: Math.floor(Math.random() * 50) + 10,
            color: c.close > c.open ? "#0ecb81" : "#ff4976",
        }));

        candleSeries.setData(candles);
        volumeSeries.setData(volumes);


        const resize = () => chart.applyOptions({ width: chartContainer.current!.clientWidth });
        window.addEventListener("resize", resize);

        // fill the chart completely
        // chart.timeScale().fitContent();

        return () => {
            window.removeEventListener("resize", resize);
            chart.remove();
        };
    }, []);

    return <div ref={chartContainer} style={{ width: "100%", height: 360, borderRadius: "5px", overflow: 'hidden' }} />;
}




// npx shadcn-ui@latest add tabs