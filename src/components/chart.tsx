'use client';

import { useEffect, useRef, useState } from "react";
import { createChart, HistogramSeries, LineSeries } from "lightweight-charts";

interface KlineData {
  bucket: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  currency_code: string;
}

type TimeResolution = '1m' | '1h' | '1w';
type Market = 'ind_wins' | 'vk_century';

export const Chart = () => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const [timeResolution, setTimeResolution] = useState<TimeResolution>('1h');
    const [market, setMarket] = useState<Market>('ind_wins');
    const [chartData, setChartData] = useState<{ time: string; value: number; volume: number }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch data from the API
    const fetchChartData = async (resolution: TimeResolution, selectedMarket: Market) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/klines?resolution=${resolution}&market=${selectedMarket}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            
            const data: KlineData[] = await response.json();
            
            // Transform the data to match the chart's expected format
            const formattedData = data.map(item => ({
                time: new Date(item.bucket).toISOString().split('T')[0], // Format as YYYY-MM-DD
                value: item.close, // Use close price for the line chart
                volume: item.volume,
            }));
            
            setChartData(formattedData);
        } catch (error) {
            console.error('Error fetching chart data:', error);
            // You might want to add error handling UI here
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when resolution or market changes
    useEffect(() => {
        fetchChartData(timeResolution, market);
    }, [timeResolution, market]);

    // Set up and update chart when data changes
    useEffect(() => {
        if (!chartContainerRef.current || chartData.length === 0) return;
        const controller = new AbortController();

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: 'transparent' },
                textColor: 'white',
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            grid: {
                vertLines: {
                    color: 'transparent',
                },
                horzLines: {
                    color: 'rgba(197, 203, 206, 0.5)',
                },
            },
        });

        chart.timeScale().fitContent();

        const newSeries = chart.addSeries(LineSeries, {
            color: 'red',
            lineWidth: 2,
            priceLineVisible: true,
            priceLineWidth: 2,
        });
        newSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.1,
                bottom: 0.3,
            },
        });

        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
        });
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.9,
                bottom: 0,
            },
        });

        const volumeData = chartData.map((item, index) => ({
            time: item.time,
            value: item.volume,
            color: index > 0 && item.value >= chartData[index - 1].value ? 'green' : 'red',
        }));

        newSeries.setData(chartData);
        volumeSeries.setData(volumeData);

        window.addEventListener("resize", () => {
            chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
        }, { signal: controller.signal });

        chartContainerRef.current.querySelector('a')?.remove();
        return () => {
            controller.abort();
            chart.remove();
        }
    }, [chartData]);

    return (
        <div className="chart-container">
            <div className="chart-controls">
                {/* Market selector */}
                <div className="market-selector">
                    <select 
                        value={market} 
                        onChange={(e) => setMarket(e.target.value as Market)}
                        className="market-select"
                    >
                        <option value="ind_wins">India Wins</option>
                        <option value="vk_century">Virat Century</option>
                    </select>
                </div>
                
                {/* Time resolution buttons */}
                <div className="time-controls">
                    <button 
                        onClick={() => setTimeResolution('1m')}
                        className={timeResolution === '1m' ? 'active' : ''}
                    >
                        1 Minute
                    </button>
                    <button 
                        onClick={() => setTimeResolution('1h')}
                        className={timeResolution === '1h' ? 'active' : ''}
                    >
                        1 Hour
                    </button>
                    <button 
                        onClick={() => setTimeResolution('1w')}
                        className={timeResolution === '1w' ? 'active' : ''}
                    >
                        1 Week
                    </button>
                </div>
            </div>
            
            {isLoading ? (
                <div className="loading">Loading chart data...</div>
            ) : (
                <div ref={chartContainerRef} />
            )}
        </div>
    );
};
