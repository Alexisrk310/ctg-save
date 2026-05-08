'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass flex items-center justify-between w-full max-w-5xl px-8 py-4 rounded-2xl shadow-premium border border-white/10"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/10">
            <img src="/logo.png" alt="CTGSave Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-black tracking-tighter premium-text-gradient">CTGSave</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">Nosotros</Link>
          <a
            href="https://github.com/Alexisrk310/ctg-save"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-full text-sm font-bold hover:scale-105 transition-all active:scale-95"
          >
            <Share2 size={18} />
            GitHub
          </a>
        </div>
      </motion.div>
    </nav>
  );
};
