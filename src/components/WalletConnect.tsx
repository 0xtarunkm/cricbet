import { Wallet } from 'lucide-react';

export function WalletConnect() {
  return (
    <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
      <Wallet className="h-5 w-5" />
      <span>Connect Wallet</span>
    </button>
  );
}
