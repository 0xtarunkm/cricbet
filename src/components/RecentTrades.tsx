import React from 'react';
import { History } from 'lucide-react';

export function RecentTrades() {
  const trades = [
    { id: 1, price: '2.15', size: '10.5', type: 'buy', time: '2 min ago' },
    { id: 2, price: '2.14', size: '5.2', type: 'sell', time: '3 min ago' },
    { id: 3, price: '2.15', size: '8.7', type: 'buy', time: '5 min ago' },
    { id: 4, price: '2.13', size: '3.1', type: 'sell', time: '7 min ago' },
    { id: 5, price: '2.12', size: '12.4', type: 'buy', time: '8 min ago' },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <History className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-bold">Recent Trades</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-gray-400">
              <th className="text-left pb-2">Price (USDC)</th>
              <th className="text-left pb-2">Size</th>
              <th className="text-left pb-2">Type</th>
              <th className="text-left pb-2">Time</th>
              <th className="text-left pb-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="text-sm border-t border-gray-700">
                <td
                  className={`py-2 ${
                    trade.type === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {trade.price}
                </td>
                <td className="py-2">{trade.size}</td>
                <td
                  className={`py-2 ${
                    trade.type === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {trade.type.toUpperCase()}
                </td>
                <td className="py-2 text-gray-400">{trade.time}</td>
                <td className="py-2">
                  {(parseFloat(trade.price) * parseFloat(trade.size)).toFixed(
                    2
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
