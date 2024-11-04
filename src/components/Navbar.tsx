'use client';

import { Target, Moon, Sun, Wallet } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { WalletConnect } from './WalletConnect';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <nav
      className={`${
        isDark ? 'bg-gray-800' : 'bg-white'
      } border-b border-gray-700`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Target className="h-8 w-8 text-blue-500" />
            <span className="text-3xl font-bold">cricbet</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-700"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}
