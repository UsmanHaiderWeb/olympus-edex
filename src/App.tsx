/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { memo, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createChart, type Time, type CandlestickData, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { Copy, ChevronDown, ArrowUp } from "lucide-react";

// Mock data for the order book to better match the image's style
const allSellOrders = [
    { price: '172.94', amount: '626.89', total: '5.62K' },
    { price: '172.92', amount: '48.28', total: '3.64K' },
    { price: '172.91', amount: '648.28', total: '3.58K' },
    { price: '172.93', amount: '755.37', total: '4.40K' },
    { price: '172.90', amount: '2.12K', total: '2.12K' },
    { price: '172.92', amount: '48.28', total: '3.64K' },
    { price: '172.91', amount: '648.28', total: '3.58K' },
];

const allBuyOrders = [
    { price: '172.89', amount: '189.58', total: '189.58' },
    { price: '172.88', amount: '82.88', total: '272.48' },
    { price: '172.87', amount: '706.46', total: '978.94' },
    { price: '172.86', amount: '701.45', total: '1.68K' },
    { price: '172.84', amount: '48.40', total: '2.52K' },
    { price: '172.83', amount: '1.34K', total: '4.79K' },
    { price: '172.85', amount: '799.55', total: '2.47K' },
];


function App() {
    const { register: registerChart, handleSubmit: handleChartSubmit } = useForm();
    const { register: registerLimit, handleSubmit: handleLimitSubmit } = useForm();
    const { register: registerMatch, handleSubmit: handleMatchSubmit } = useForm();
    const [orderFilter, setOrderFilter] = useState('all'); // 'all', 'buy', 'sell'

    const onChartSubmit = (data: any) => console.log("Chart Order:", data);
    const onLimitSubmit = (data: any) => console.log("Limit Order:", data);
    const onMatchSubmit = (data: any) => console.log("Match Order:", data);

    const sellOrders = orderFilter === 'buy' ? [] : allSellOrders;
    const buyOrders = orderFilter === 'sell' ? [] : allBuyOrders;

    const tabTriggerClasses = "px-2 pb-2 text-xs font-medium text-gray-400 bg-transparent border-b-2 border-transparent rounded-none hover:text-white data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:shadow-none border-0 border-b-2 data-[state=active]:border-yellow-500";

    return (
        <div className="bg-[#0B0E11] text-gray-300 min-h-screen font-sans text-xs">
            {/* Header */}
            <header className="flex items-center justify-between p-2 bg-[#181A20]">
                {/* Left Section */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-yellow-500">Ω</div>
                        <span className="font-bold text-white text-sm">Futures</span>
                    </div>
                    <nav className="hidden lg:flex items-center gap-4 text-xs">
                        <a href="#" className="text-gray-300 hover:text-white">Options</a>
                        <a href="#" className="text-gray-300 hover:text-white">Trading Bots</a>
                        <a href="#" className="text-gray-300 hover:text-white">Copy Trading</a>
                        <a href="#" className="text-gray-300 hover:text-white">Smart Money</a>
                        <a href="#" className="text-gray-300 hover:text-white">Campaigns</a>
                        <a href="#" className="text-gray-300 hover:text-white flex items-center gap-1">Data <ChevronDown size={12} /></a>
                        <a href="#" className="text-gray-300 hover:text-white flex items-center gap-1">More <ChevronDown size={12} /></a>
                    </nav>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" className="hover:bg-gray-700 hover:text-white text-xs px-3">Log In</Button>
                        <Button className="bg-yellow-500 text-black font-semibold hover:bg-yellow-600 text-xs px-3">Sign Up</Button>
                    </div>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-1 p-1">
                {/* Left Column (Chart) */}
                <div className="lg:col-span-6 flex flex-col gap-1">
                    {/* Info Bar */}
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 p-2 bg-[#181A20] rounded-md">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">SOLUSDT</span>
                            <span className="text-xs text-gray-400">Perp</span>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-green-500">172.89</div>
                            <div className="text-xs text-gray-400">172.92</div>
                        </div>
                        <div className="text-xs">
                            <div className="text-gray-400">24h Change</div>
                            <div className="text-red-500">-0.43%</div>
                        </div>
                        <div className="text-xs">
                            <div className="text-gray-400">24h High</div>
                            <div>178.17</div>
                        </div>
                        <div className="text-xs">
                            <div className="text-gray-400">24h Low</div>
                            <div>168.71</div>
                        </div>
                        <div className="text-xs">
                            <div className="text-gray-400">24h Volume(USDT)</div>
                            <div>33.81M</div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-[#181A20] p-1 rounded-md flex-grow">
                        <CandleChart />
                    </div>
                </div>

                {/* Middle Column (Order Book) */}
                <div className="lg:col-span-2 flex flex-col gap-2">
                    <div className="bg-[#181A20] p-3 rounded-md flex-grow">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-sm">Order Book</h3>
                            <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-md">
                                <button onClick={() => setOrderFilter('all')} className={`p-1 rounded ${orderFilter === 'all' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="2" y="8" width="4" height="6" fill="#F44336" />
                                        <rect x="2" y="2" width="4" height="5" fill="#4CAF50" />
                                        <rect x="7" y="5" width="4" height="9" fill="#F44336" />
                                        <rect x="7" y="2" width="4" height="2" fill="#4CAF50" />
                                    </svg>
                                </button>
                                <button onClick={() => setOrderFilter('sell')} className={`p-1 rounded ${orderFilter === 'sell' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="2" y="2" width="4" height="12" fill="#F44336" />
                                        <rect x="7" y="2" width="4" height="12" fill="#F44336" />
                                    </svg>
                                </button>
                                <button onClick={() => setOrderFilter('buy')} className={`p-1 rounded ${orderFilter === 'buy' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="2" y="2" width="4" height="12" fill="#4CAF50" />
                                        <rect x="7" y="2" width="4" height="12" fill="#4CAF50" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="border-b border-gray-700 hover:bg-transparent">
                                    <TableHead className="text-gray-400 font-medium p-1 text-xs">Price (USDT)</TableHead>
                                    <TableHead className="text-gray-400 font-medium text-right p-1 text-xs">Amount (SOL)</TableHead>
                                    <TableHead className="text-gray-400 font-medium text-right p-1 text-xs">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sellOrders.map((order, index) => (
                                    <TableRow key={`sell-${index}`} className="border-none hover:bg-gray-700/50 text-xs">
                                        <TableCell className="text-red-500 p-1">{order.price}</TableCell>
                                        <TableCell className="text-right p-1">{order.amount}</TableCell>
                                        <TableCell className="text-right p-1">{order.total}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="border-transparent hover:bg-transparent">
                                    <TableCell colSpan={3} className="text-lg font-bold text-green-500 py-2 p-1">
                                        172.89 <ArrowUp className="inline-block h-4 w-4" />
                                    </TableCell>
                                </TableRow>
                                {buyOrders.map((order, index) => (
                                    <TableRow key={`buy-${index}`} className="border-none hover:bg-gray-700/50 text-xs">
                                        <TableCell className="text-green-500 p-1">{order.price}</TableCell>
                                        <TableCell className="text-right p-1">{order.amount}</TableCell>
                                        <TableCell className="text-right p-1">{order.total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="bg-[#181A20] p-3 rounded-md">
                        <h2 className="font-bold text-sm mb-2">Match Orders</h2>
                        <form onSubmit={handleMatchSubmit(onMatchSubmit)} className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <Input {...registerMatch("buyOrderId")} placeholder="Enter Buy Order ID" className="bg-[#2e333a] border-gray-600 text-xs" />
                                <Input {...registerMatch("sellOrderId")} placeholder="Enter Sell Order ID" className="bg-[#2e333a] border-gray-600 text-xs" />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-md text-xs">Match Orders</Button>
                        </form>
                    </div>
                </div>

                {/* Right Column (Trade Form & Project Overview) */}
                <div className="lg:col-span-2 bg-[#181A20] p-3 rounded-md space-y-4">
                    <Tabs defaultValue="chart">
                        <TabsList className="bg-transparent h-auto w-full justify-start">
                            <TabsTrigger value="chart" className={tabTriggerClasses}>Chart Price</TabsTrigger>
                            <TabsTrigger value="limit" className={tabTriggerClasses}>Limit Order</TabsTrigger>
                        </TabsList>

                        <TabsContent value="chart" className="mt-4">
                            <form onSubmit={handleChartSubmit(onChartSubmit)} className="space-y-3">
                                <div className="w-full flex flex-col gap-1.5">
                                    <Select>
                                        <SelectTrigger className="w-full bg-[#2e333a] border-gray-600 text-xs">
                                            <SelectValue className="w-full" placeholder="Buy" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e333a] border-gray-600 text-white">
                                            <SelectItem value="buy">Buy</SelectItem>
                                            <SelectItem value="sell">Sell</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input  {...registerChart("amount")} placeholder="Chart price auto" className="bg-[#2e333a] border-gray-600 text-xs" />
                                    <Input {...registerChart("amount")} placeholder="Amount" className="bg-[#2e333a] border-gray-600 text-xs" />
                                </div>
                                <Separator className="my-4 bg-gray-700" />
                                <div className="flex flex-col gap-1.5">
                                    <Button type="button" className="w-full bg-[#FCD535] text-black font-semibold hover:bg-[#F0B90B] rounded-md text-xs">Approve</Button>
                                    <Button type="submit" className="w-full bg-[#5E6673] text-white font-semibold hover:bg-[#848E9C] rounded-md text-xs">Deposit</Button>
                                </div>
                            </form>
                        </TabsContent>

                        <TabsContent value="limit" className="mt-4">
                            <form onSubmit={handleLimitSubmit(onLimitSubmit)} className="space-y-3">
                                <div className="w-full flex flex-col gap-1.5">
                                    <Select>
                                        <SelectTrigger className="w-full bg-[#2e333a] border-gray-600 text-xs">
                                            <SelectValue className="w-full" placeholder="Buy" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e333a] border-gray-600 text-white">
                                            <SelectItem value="buy">Buy</SelectItem>
                                            <SelectItem value="sell">Sell</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input {...registerLimit("limitPrice")} placeholder="Set limit price" className="bg-[#2e333a] border-gray-600 text-xs" />
                                    <Input {...registerLimit("amount")} placeholder="Amount" className="bg-[#2e333a] border-gray-600 text-xs" />
                                </div>
                                <Separator className="my-4 bg-gray-700" />
                                <div className="flex flex-col gap-1.5">
                                    <Button type="button" className="w-full bg-yellow-500 text-black font-semibold hover:bg-yellow-600 rounded-md text-xs">Approve</Button>
                                    <Button type="submit" className="w-full bg-green-600 text-white font-semibold hover:bg-green-700 rounded-md text-xs">Deposit</Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <Separator className="my-4 bg-gray-700" />

                    <div className="text-left space-y-3">
                        <h4 className="font-bold text-sm underline">Project Overview:</h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center">Base Token Contract: <Button size="sm" variant="outline" className="px-2 py-1 h-auto bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300">Copy <Copy className="ml-2 h-3 w-3" /></Button></div>
                            <div className="flex justify-between items-center">Escrow Contract: <Button size="sm" variant="outline" className="px-2 py-1 h-auto bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300">Copy <Copy className="ml-2 h-3 w-3" /></Button></div>
                            <div className="flex justify-between items-center">Quote Token Contract: <Button size="sm" variant="outline" className="px-2 py-1 h-auto bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300">Copy <Copy className="ml-2 h-3 w-3" /></Button></div>
                            <div className="flex justify-between items-center">Base Token Supply: <span>--</span></div>
                            <div className="flex justify-between items-center">Quote Token Supply: <span>--</span></div>
                            <div className="flex justify-between items-center">Website: <a href="https://omeganetwork.co" className="text-blue-400 hover:underline" target="_blank" rel="noreferrer">omeganetwork.co</a></div>
                            <div className="flex justify-between items-center">Whitepaper: <a href="#" className="text-blue-400 hover:underline">GitBook</a></div>
                            <div className="flex justify-between items-center">Discord: <span className="text-gray-500">Not yet provided</span></div>
                        </div>
                    </div>
                </div>

                {/* Full-width Positions / Orders Tabs */}
                <div className="lg:col-span-10 bg-[#181A20] p-3 rounded-md">
                    <Tabs defaultValue="positions">
                        <TabsList className="bg-transparent h-auto w-full justify-start">
                            <TabsTrigger value="positions" className={tabTriggerClasses}>Positions(0)</TabsTrigger>
                            <TabsTrigger value="open-orders" className={tabTriggerClasses}>Open Orders(0)</TabsTrigger>
                            <TabsTrigger value="order-history" className={tabTriggerClasses}>Order History</TabsTrigger>
                            <TabsTrigger value="trade-history" className={tabTriggerClasses}>Trade History</TabsTrigger>
                            <TabsTrigger value="transaction-history" className={tabTriggerClasses}>Transaction History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="positions" className="mt-4 text-sm text-center text-gray-500 min-h-[300px] flex items-center justify-center">
                            You have no open positions.
                        </TabsContent>
                        <TabsContent value="open-orders" className="mt-4 text-sm text-center text-gray-500 min-h-[300px] flex items-center justify-center">
                            You have no open orders.
                        </TabsContent>
                        <TabsContent value="order-history" className="mt-4 text-sm text-center text-gray-500 min-h-[300px] flex items-center justify-center">
                            You have no order history.
                        </TabsContent>
                        <TabsContent value="trade-history" className="mt-4 text-sm text-center text-gray-500 min-h-[300px] flex items-center justify-center">
                            You have no trade history.
                        </TabsContent>
                        <TabsContent value="transaction-history" className="mt-4 text-sm text-center text-gray-500 min-h-[300px] flex items-center justify-center">
                            You have no transaction history.
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default memo(App);


// CandleChart.jsx
function CandleChart() {
    const chartContainer = useRef<HTMLDivElement>(null);
    const candles: CandlestickData<Time>[] = Array.from({ length: 250 }, (_, index) => {
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
        if (!chartContainer.current) return;

        const chart = createChart(chartContainer.current!, {
            layout: {
                background: { color: "#181A20" }, // Updated background color
                textColor: "#d1d1d1",
                fontSize: 10,
            },
            grid: {
                vertLines: { color: "rgba(255, 255, 255, 0.1)" }, // Updated grid color
                horzLines: { color: "rgba(255, 255, 255, 0.1)" }, // Updated grid color
            },
            width: chartContainer.current!.clientWidth,
            height: 450, // Updated height for better layout fit
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

        chart.panes()[0].setHeight(0.75);
        chart.panes()[1].setHeight(0.25);


        const volumes = candles.map(c => ({
            time: c.time,
            value: Math.floor(Math.random() * 50) + 10,
            color: c.close > c.open ? "rgba(14, 203, 129, 0.5)" : "rgba(255, 73, 118, 0.5)", // Updated volume colors
        }));

        candleSeries.setData(candles);
        volumeSeries.setData(volumes);

        const resize = () => chart.applyOptions({ width: chartContainer.current!.clientWidth, height: chartContainer.current!.clientHeight });
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
            chart.remove();
        };
    }, []);

    return <div ref={chartContainer} style={{ width: "100%", height: "100%", minHeight: "450px" }} />;
}
