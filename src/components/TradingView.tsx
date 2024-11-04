import React from 'react';
import { LineChart } from 'lucide-react';

export function TradingView() {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <LineChart className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-bold">Price Chart</h2>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
            1H
          </button>
          <button className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
            1D
          </button>
          <button className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
            1W
          </button>
        </div>
      </div>
      <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Chart View</span>
      </div>
    </div>
  );
}
