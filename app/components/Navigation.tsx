'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="py-4 px-8 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold font-serif green">
        LearnViet
      </Link>
      
      <div className="flex gap-8">
        <Link 
          href="/" 
          className={`${
            pathname === '/' 
              ? 'border-b-2 border-black' 
              : ''
          } hover:border-b-2 hover:border-gray-200 pb-1 transition-colors`}
        >
          Home
        </Link>
        <Link 
          href="/practice" 
          className={`${
            pathname === '/practice' 
              ? 'border-b-2 border-black' 
              : ''
          } hover:border-b-2 hover:border-gray-200 pb-1 transition-colors`}
        >
          Practice reading
        </Link>
        <Link 
          href="/library" 
          className={`${
            pathname.startsWith('/library') 
              ? 'border-b-2 border-black' 
              : ''
          } hover:border-b-2 hover:border-gray-200 pb-1 transition-colors`}
        >
          Library
        </Link>
      </div>
    </nav>
  )
}