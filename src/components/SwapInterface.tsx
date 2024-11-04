'use client';

import React, { useState } from 'react';
import { ArrowDownUp, ArrowDown } from 'lucide-react';

export function SwapInterface() {
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [predictionType, setPredictionType] = useState('yes');

  const expectedPrice = predictionType === 'yes' ? '0.65' : '0.35';
  const outputToken = `${predictionType.toUpperCase()}-INDIA`;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <ArrowDownUp className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-bold">Swap</h2>
        </div>
        <div className="flex bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setPredictionType('yes')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              predictionType === 'yes'
                ? 'bg-green-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            YES
          </button>
          <button
            onClick={() => setPredictionType('no')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              predictionType === 'no'
                ? 'bg-red-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            NO
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Input Token */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-400">You pay</label>
            <span className="text-sm text-gray-400">Balance: 1000 USDC</span>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => {
                setInputAmount(e.target.value);
                setOutputAmount(
                  (
                    parseFloat(e.target.value) / parseFloat(expectedPrice)
                  ).toFixed(2)
                );
              }}
              className="flex-1 bg-transparent text-2xl font-medium focus:outline-none"
              placeholder="0.00"
            />
            <div className="flex items-center space-x-2 bg-gray-600 px-3 py-1 rounded-lg">
              <img
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                alt="USDC"
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium">USDC</span>
            </div>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-2">
          <div className="bg-gray-700 p-2 rounded-full">
            <ArrowDown className="h-4 w-4 text-blue-500" />
          </div>
        </div>

        {/* Output Token */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-400">You receive</label>
            <span className="text-sm text-gray-400">
              Price: {expectedPrice} USDC
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={outputAmount}
              onChange={(e) => {
                setOutputAmount(e.target.value);
                setInputAmount(
                  (
                    parseFloat(e.target.value) * parseFloat(expectedPrice)
                  ).toFixed(2)
                );
              }}
              className="flex-1 bg-transparent text-2xl font-medium focus:outline-none"
              placeholder="0.00"
            />
            <div className="flex items-center space-x-2 bg-gray-600 px-3 py-1 rounded-lg">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  predictionType === 'yes' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {predictionType === 'yes' ? '✓' : '✗'}
              </div>
              <span className="font-medium">{outputToken}</span>
            </div>
          </div>
        </div>

        {/* Market Info */}
        <div className="bg-gray-700 rounded-lg p-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Market Question</span>
            <span className="text-right">
              Will India win the Border Gavaskar Trophy?
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Resolution Date</span>
            <span>March 25, 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Network Fee</span>
            <span>0.001 SOL</span>
          </div>
        </div>

        <button
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            inputAmount
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!inputAmount}
        >
          {inputAmount ? 'Confirm Swap' : 'Enter an amount'}
        </button>
      </div>
    </div>
  );
}
