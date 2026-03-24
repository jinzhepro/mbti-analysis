'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/test', label: '开始探索' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-1 bg-black/40 rounded-full" />
              <span className="absolute inset-0 flex items-center justify-center text-amber-300 font-serif text-lg font-bold">
                M
              </span>
            </div>
            <span className="text-xl font-serif text-amber-100/90 group-hover:text-amber-200 transition-colors">
              人格星辰
            </span>
          </Link>

          <nav className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-5 py-2 rounded-full text-sm font-serif tracking-wide transition-all duration-300 ${
                  pathname === item.href
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-amber-100/60 hover:text-amber-200 hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
