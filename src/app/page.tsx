'use client';

import { Markets } from '@/components/Markets';
import { useTheme } from '@/hooks/useTheme';

export default function Home() {
  const { isDark } = useTheme();
  return (
    <div
      className={`min-h-screen px-10 py-8 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <Markets />
    </div>
  );
}
