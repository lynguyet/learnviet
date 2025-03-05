'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('mobile-nav');
      if (nav && !nav.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  
  return (
    <>
      {/* Header with logo and menu button */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold">
                LearnViet
              </Link>
            </div>
            
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">
                  {isMenuOpen ? 'Close main menu' : 'Open main menu'}
                </span>
                {isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <div className="flex items-center">
                    <span className="mr-2">Menu</span>
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out`}
        style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" 
             onClick={() => setIsMenuOpen(false)}
             style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}></div>
        
        <nav className="relative flex flex-col h-full w-full max-w-xs bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold">
                LearnViet
              </Link>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-center px-4 sm:px-6">
            <div className="space-y-8 text-right">
              <Link
                href="/"
                className={`block text-lg ${
                  pathname === '/' ? 'font-bold border-b-2 border-black pb-1' : ''
                }`}
              >
                Home
              </Link>
              <Link
                href="/practice"
                className={`block text-lg ${
                  pathname === '/practice' ? 'font-bold border-b-2 border-black pb-1' : ''
                }`}
              >
                Practice reading
              </Link>
              <Link
                href="/library"
                className={`block text-lg ${
                  pathname === '/library' ? 'font-bold border-b-2 border-black pb-1' : ''
                }`}
              >
                Library
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}