import React from 'react';
import { Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Markets() {
  const router = useRouter();
  const markets = [
    {
      id: 1,
      team1: 'India',
      team2: 'Australia',
      date: '2024-03-25',
      volume: '234.5K SOL',
      change: '+5.2%',
      image:
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 2,
      team1: 'England',
      team2: 'Pakistan',
      date: '2024-03-26',
      volume: '156.2K SOL',
      change: '-2.1%',
      image:
        'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h1 className="text-2xl font-bold">Cricket Markets</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {markets.map((market) => (
          <div
            key={market.id}
            onClick={() => router.push(`/market/${market.id}`)}
            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
          >
            <img
              src={market.image}
              alt={`${market.team1} vs ${market.team2}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">
                  {market.team1} vs {market.team2}
                </h3>
                <span
                  className={
                    market.change.startsWith('+')
                      ? 'text-green-400'
                      : 'text-red-400'
                  }
                >
                  {market.change}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{market.date}</span>
                <span>{market.volume}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
