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
type Market = 'vk_century';

export const Chart = () => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const [timeResolution, setTimeResolution] = useState<TimeResolution>('1h');
    const [market, setMarket] = useState<Market>('vk_century');
    const [chartData, setChartData] = useState<{ time: string; value: number; volume: number }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchChartData = async (resolution: TimeResolution, selectedMarket: Market) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/klines?resolution=${resolution}&market=${selectedMarket}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            
            const data: KlineData[] = await response.json();
            
            const formattedData = data.map(item => ({
                time: new Date(item.bucket).toISOString().split('T')[0], 
                value: item.close, 
                volume: item.volume,
            }));
            
            setChartData(formattedData);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChartData(timeResolution, market);
    }, [timeResolution, market]);

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

        // Format data for the price series - ensure unique timestamps
        const priceData = chartData
            .map(item => ({
                time: item.time,
                value: item.value,
            }))
            // Filter out duplicate timestamps
            .filter((item, index, self) => 
                index === self.findIndex(t => t.time === item.time)
            )
            // Sort by time
            .sort((a, b) => {
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;
                return 0;
            });

        // Format data for the volume series - ensure the same filtering
        const volumeData = chartData
            .map((item, index) => ({
                time: item.time,
                value: item.volume,
                color: index > 0 && item.value >= chartData[index - 1].value ? '#26A69A' : '#EF5350',
            }))
            // Filter out duplicate timestamps
            .filter((item, index, self) => 
                index === self.findIndex(t => t.time === item.time)
            )
            // Sort by time
            .sort((a, b) => {
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;
                return 0;
            });

        newSeries.setData(priceData);
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
