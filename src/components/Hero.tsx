'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Link as LinkIcon, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Hero = ({ onDownload }: { onDownload: (url: string) => void }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) onDownload(url);
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10"
      >

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          Guarda lo que <br /> <span className="premium-text-gradient">te importa.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-medium">
          Descarga videos de YouTube de forma instantánea, privada y con la máxima calidad posible. 
          Una experiencia diseñada para ser rápida y minimalista.
        </p>

        <form 
          onSubmit={handleSubmit}
          className="relative w-full max-w-3xl mx-auto group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200" />
          
          <div className="relative flex items-center bg-black border border-white/10 rounded-[1.8rem] p-2 pr-3 shadow-2xl">
            <div className="pl-4 text-white/30">
              <LinkIcon size={20} />
            </div>
            
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Pega el enlace de YouTube aquí..."
              className="w-full bg-transparent border-none outline-none px-4 py-4 text-white text-lg placeholder:text-white/20"
            />
            
            <button
              type="submit"
              disabled={!url}
              className={cn(
                "flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all duration-300",
                url 
                  ? "premium-gradient text-white shadow-[0_0_20px_rgba(0,112,243,0.4)] hover:scale-[1.02] active:scale-[0.98]" 
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              )}
            >
              <Download size={20} />
              <span>Descargar</span>
            </button>
          </div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 flex items-center justify-center gap-8 text-white/30 text-sm font-medium"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            Sin anuncios
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            Calidad 4K
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            Privado
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
