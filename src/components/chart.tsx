'use client';

import { useEffect, useRef } from "react";
import { createChart, HistogramSeries, LineSeries } from "lightweight-charts";

const initialData = [
    { time: '2023-01-01', value: 16500, volume: 1500 },
    { time: '2023-01-02', value: 16800, volume: 1800 },
    { time: '2023-01-03', value: 17000, volume: 2000 },
    { time: '2023-01-04', value: 16850, volume: 1600 },
    { time: '2023-01-05', value: 17200, volume: 2200 },
    { time: '2023-01-06', value: 17500, volume: 2500 },
    { time: '2023-01-07', value: 17300, volume: 1900 },
    { time: '2023-01-08', value: 17400, volume: 2100 },
    { time: '2023-01-09', value: 17600, volume: 2300 },
    { time: '2023-01-10', value: 17900, volume: 2600 },
    { time: '2023-01-11', value: 18200, volume: 2800 },
    { time: '2023-01-12', value: 18000, volume: 2400 },
    { time: '2023-01-13', value: 17800, volume: 2000 },
    { time: '2023-01-14', value: 17900, volume: 2200 },
    { time: '2023-01-15', value: 18100, volume: 2500 },
    { time: '2023-01-16', value: 18400, volume: 2700 },
    { time: '2023-01-17', value: 18600, volume: 2900 },
    { time: '2023-01-18', value: 18500, volume: 2300 },
    { time: '2023-01-19', value: 18300, volume: 2100 },
    { time: '2023-01-20', value: 18400, volume: 2400 },
    { time: '2023-01-21', value: 18700, volume: 2600 },
    { time: '2023-01-22', value: 19000, volume: 3000 },
    { time: '2023-01-23', value: 18800, volume: 2500 },
    { time: '2023-01-24', value: 18600, volume: 2200 },
    { time: '2023-01-25', value: 18700, volume: 2400 },
    { time: '2023-01-26', value: 19000, volume: 2700 },
    { time: '2023-01-27', value: 19300, volume: 3100 },
    { time: '2023-01-28', value: 19100, volume: 2600 },
    { time: '2023-01-29', value: 18900, volume: 2300 },
    { time: '2023-01-30', value: 19000, volume: 2500 },
    { time: '2023-01-31', value: 19300, volume: 2800 },
    { time: '2023-02-01', value: 19600, volume: 3200 },
    { time: '2023-02-02', value: 19400, volume: 2700 },
    { time: '2023-02-03', value: 19200, volume: 2400 },
    { time: '2023-02-04', value: 19300, volume: 2600 },
    { time: '2023-02-05', value: 19600, volume: 2900 },
    { time: '2023-02-06', value: 19900, volume: 3300 },
    { time: '2023-02-07', value: 19700, volume: 2800 },
    { time: '2023-02-08', value: 19500, volume: 2500 },
    { time: '2023-02-09', value: 19600, volume: 2700 },
    { time: '2023-02-10', value: 19900, volume: 3000 },
    { time: '2023-02-11', value: 20200, volume: 3400 },
    { time: '2023-02-12', value: 20000, volume: 2900 },
    { time: '2023-02-13', value: 19800, volume: 2600 },
    { time: '2023-02-14', value: 19900, volume: 2800 },
    { time: '2023-02-15', value: 20200, volume: 3100 },
    { time: '2023-02-16', value: 20500, volume: 3500 },
    { time: '2023-02-17', value: 20300, volume: 3000 },
    { time: '2023-02-18', value: 20100, volume: 2700 },
    { time: '2023-02-19', value: 20200, volume: 2900 },
    { time: '2023-02-20', value: 20500, volume: 3200 },
    { time: '2023-02-21', value: 20800, volume: 3600 },
    { time: '2023-02-22', value: 20600, volume: 3100 },
    { time: '2023-02-23', value: 20400, volume: 2800 },
    { time: '2023-02-24', value: 20500, volume: 3000 },
    { time: '2023-02-25', value: 20800, volume: 3300 },
    { time: '2023-02-26', value: 21100, volume: 3700 },
    { time: '2023-02-27', value: 20900, volume: 3200 },
    { time: '2023-02-28', value: 20700, volume: 2900 },
    { time: '2023-03-01', value: 20800, volume: 3100 },
    { time: '2023-03-02', value: 21100, volume: 3400 },
    { time: '2023-03-03', value: 21400, volume: 3800 },
    { time: '2023-03-04', value: 21200, volume: 3300 },
    { time: '2023-03-05', value: 21000, volume: 3000 },
    { time: '2023-03-06', value: 21100, volume: 3200 },
    { time: '2023-03-07', value: 21400, volume: 3500 },
    { time: '2023-03-08', value: 21700, volume: 3900 },
    { time: '2023-03-09', value: 21500, volume: 3400 },
    { time: '2023-03-10', value: 21300, volume: 3100 },
    { time: '2023-03-11', value: 21400, volume: 3300 },
    { time: '2023-03-12', value: 21700, volume: 3600 },
    { time: '2023-03-13', value: 22000, volume: 4000 },
    { time: '2023-03-14', value: 21800, volume: 3500 },
    { time: '2023-03-15', value: 21600, volume: 3200 },
    { time: '2023-03-16', value: 21700, volume: 3400 },
    { time: '2023-03-17', value: 22000, volume: 3700 },
    { time: '2023-03-18', value: 22300, volume: 4100 },
    { time: '2023-03-19', value: 22100, volume: 3600 },
    { time: '2023-03-20', value: 21900, volume: 3300 },
    { time: '2023-03-21', value: 22000, volume: 3500 },
    { time: '2023-03-22', value: 22300, volume: 3800 },
    { time: '2023-03-23', value: 22600, volume: 4200 },
    { time: '2023-03-24', value: 22400, volume: 3700 },
    { time: '2023-03-25', value: 22200, volume: 3400 },
    { time: '2023-03-26', value: 22300, volume: 3600 },
    { time: '2023-03-27', value: 22600, volume: 3900 },
    { time: '2023-03-28', value: 22900, volume: 4300 },
    { time: '2023-03-29', value: 22700, volume: 3800 },
    { time: '2023-03-30', value: 22500, volume: 3500 },
    { time: '2023-03-31', value: 22600, volume: 3700 },
    { time: '2023-04-01', value: 22900, volume: 4000 },
    { time: '2023-04-02', value: 23200, volume: 4400 },
    { time: '2023-04-03', value: 23000, volume: 3900 },
    { time: '2023-04-04', value: 22800, volume: 3600 },
    { time: '2023-04-05', value: 22900, volume: 3800 },
    { time: '2023-04-06', value: 23200, volume: 4100 },
    { time: '2023-04-07', value: 23500, volume: 4500 },
    { time: '2023-04-08', value: 23300, volume: 4000 },
    { time: '2023-04-09', value: 23100, volume: 3700 },
    { time: '2023-04-10', value: 23200, volume: 3900 },
    { time: '2023-04-11', value: 23500, volume: 4200 },
    { time: '2023-04-12', value: 23800, volume: 4600 },
    { time: '2023-04-13', value: 23600, volume: 4100 },
    { time: '2023-04-14', value: 23400, volume: 3800 },
    { time: '2023-04-15', value: 23500, volume: 4000 },
    { time: '2023-04-16', value: 23800, volume: 4300 },
    { time: '2023-04-17', value: 24100, volume: 4700 },
    { time: '2023-04-18', value: 23900, volume: 4200 },
    { time: '2023-04-19', value: 23700, volume: 3900 },
    { time: '2023-04-20', value: 23800, volume: 4100 },
    { time: '2023-04-21', value: 24100, volume: 4400 },
    { time: '2023-04-22', value: 24400, volume: 4800 },
    { time: '2023-04-23', value: 24200, volume: 4300 },
    { time: '2023-04-24', value: 24000, volume: 4000 },
    { time: '2023-04-25', value: 24100, volume: 4200 },
    { time: '2023-04-26', value: 24400, volume: 4500 },
    { time: '2023-04-27', value: 24700, volume: 4900 },
    { time: '2023-04-28', value: 24500, volume: 4400 },
    { time: '2023-04-29', value: 24300, volume: 4100 },
    { time: '2023-04-30', value: 24400, volume: 4300 },
    { time: '2023-05-01', value: 24700, volume: 4600 },
    { time: '2023-05-02', value: 25000, volume: 5000 },
    { time: '2023-05-03', value: 24800, volume: 4500 },
    { time: '2023-05-04', value: 24600, volume: 4200 },
    { time: '2023-05-05', value: 24700, volume: 4400 },
    { time: '2023-05-06', value: 25000, volume: 4700 },
    { time: '2023-05-07', value: 25300, volume: 5100 },
    { time: '2023-05-08', value: 25100, volume: 4600 },
    { time: '2023-05-09', value: 24900, volume: 4300 },
    { time: '2023-05-10', value: 25000, volume: 4500 },
    { time: '2023-05-11', value: 25300, volume: 4800 },
    { time: '2023-05-12', value: 25600, volume: 5200 },
    { time: '2023-05-13', value: 25400, volume: 4700 },
    { time: '2023-05-14', value: 25200, volume: 4400 },
    { time: '2023-05-15', value: 25300, volume: 4600 },
    { time: '2023-05-16', value: 25600, volume: 4900 },
    { time: '2023-05-17', value: 25900, volume: 5300 },
    { time: '2023-05-18', value: 25700, volume: 4800 },
    { time: '2023-05-19', value: 25500, volume: 4500 },
    { time: '2023-05-20', value: 25600, volume: 4700 },
    { time: '2023-05-21', value: 25900, volume: 5000 },
    { time: '2023-05-22', value: 26200, volume: 5400 },
    { time: '2023-05-23', value: 26000, volume: 4900 },
    { time: '2023-05-24', value: 25800, volume: 4600 },
    { time: '2023-05-25', value: 25900, volume: 4800 },
    { time: '2023-05-26', value: 26200, volume: 5100 },
    { time: '2023-05-27', value: 26500, volume: 5500 },
    { time: '2023-05-28', value: 26300, volume: 5000 },
    { time: '2023-05-29', value: 26100, volume: 4700 },
    { time: '2023-05-30', value: 26200, volume: 4900 },
    { time: '2023-05-31', value: 26500, volume: 5200 },
    { time: '2023-06-01', value: 26800, volume: 5600 },
    { time: '2023-06-02', value: 26600, volume: 5100 },
    { time: '2023-06-03', value: 26400, volume: 4800 },
    { time: '2023-06-04', value: 26500, volume: 5000 },
    { time: '2023-06-05', value: 26800, volume: 5300 },
    { time: '2023-06-06', value: 27100, volume: 5700 },
    { time: '2023-06-07', value: 26900, volume: 5200 },
    { time: '2023-06-08', value: 26700, volume: 4900 },
    { time: '2023-06-09', value: 26800, volume: 5100 },
    { time: '2023-06-10', value: 27100, volume: 5400 },
    { time: '2023-06-11', value: 27400, volume: 5800 },
    { time: '2023-06-12', value: 27200, volume: 5300 },
    { time: '2023-06-13', value: 27000, volume: 5000 },
    { time: '2023-06-14', value: 27100, volume: 5200 },
    { time: '2023-06-15', value: 27400, volume: 5500 },
    { time: '2023-06-16', value: 27700, volume: 5900 },
    { time: '2023-06-17', value: 27500, volume: 5400 },
    { time: '2023-06-18', value: 27300, volume: 5100 },
    { time: '2023-06-19', value: 27400, volume: 5300 }
];

export const Chart = () => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;
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

        const volumeData = initialData.map((item) => ({
            time: item.time,
            value: item.volume,
            color: item.value >= initialData[initialData.indexOf(item) - 1]?.value ? 'green' : 'red', // Color based on previous value
        }));

        newSeries.setData(initialData);
        volumeSeries.setData(volumeData);

        window.addEventListener("resize", () => {
            chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
        }, { signal: controller.signal });

        chartContainerRef.current.querySelector('a')?.remove();
        return () => {
            controller.abort();
            chart.remove();
        }
    }, []);

    return (
        <div ref={chartContainerRef} />
    )
}
