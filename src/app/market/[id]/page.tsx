import { RecentTrades } from '@/components/RecentTrades';
import { SwapInterface } from '@/components/SwapInterface';
import { TradingView } from '@/components/TradingView';
import React from 'react';
// import { useParams } from 'react-router-dom';
// import { TradingView } from '../components/TradingView';
// import { RecentTrades } from '../components/RecentTrades';
// import { SwapInterface } from '../components/SwapInterface';

function MarketDetail() {
  // Mock data - in a real app, fetch based on id
  const market = {
    id: 1,
    team1: 'India',
    team2: 'Australia',
    date: '2024-03-25',
    currentPrice: '2.15 SOL',
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {market.team1} vs {market.team2}
        </h1>
        <div className="text-gray-400">Match Date: {market.date}</div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <TradingView />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <SwapInterface />
        </div>
        <div className="col-span-12">
          <RecentTrades />
        </div>
      </div>
    </div>
  );
}

export default MarketDetail;
