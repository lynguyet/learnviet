'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
// If you're using Navigation directly in this file, add this import:
// import Navigation from './components/Navigation';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10">
        {/* Remove this line if it exists: */}
        {/* <Navigation /> */}
        
        <main className="container mx-auto px-4 min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
              style={{ 
                transform: `translateY(${scrollY * 0.1}px)` 
              }}
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl font-bold mb-6 text-gray-800"
              >
                Welcome!
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-gray-700 mb-8 leading-relaxed"
              >
                I developed this tool to support my students at Lạc Hồng Vietnamese School in Everett, 
                where I teach Level 2. At this level, students are already familiar with basic sentence 
                structures and are building on their foundational skills. While this tool is designed 
                to enhance their learning experience, it is not intended to be the sole resource for 
                studying Vietnamese.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-gray-700 mb-8 leading-relaxed"
              >
                For my students, the{' '}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/library" className="text-blue-600 hover:text-blue-800 underline decoration-2 decoration-blue-500/30 hover:decoration-blue-500 transition-colors">
                    Library
                  </Link>
                </motion.span>
                {' '}section contains all the lessons we&apos;ve covered in class, 
                organized by topic for easy reference. The{' '}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/practice" className="text-blue-600 hover:text-blue-800 underline decoration-2 decoration-blue-500/30 hover:decoration-blue-500 transition-colors">
                    Practice Reading
                  </Link>
                </motion.span>
                {' '}section features a variety of paragraphs designed to help you refine your pronunciation and improve your fluency.
              </motion.p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}