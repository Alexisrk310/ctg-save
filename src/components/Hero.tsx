'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Link as LinkIcon, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Hero = ({ onDownload, isLoading }: { onDownload: (url: string) => void, isLoading: boolean }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && !isLoading) onDownload(url);
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden">
      {/* Dynamic Flag Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-ctg-red/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ctg-yellow/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-ctg-green/15 blur-[120px] rounded-full animate-float pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-ctg-red" />
            <div className="w-2 h-2 rounded-full bg-ctg-yellow" />
            <div className="w-2 h-2 rounded-full bg-ctg-green" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Hecho en Cartagena</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
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
          {/* Animated Gradient Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-ctg-red via-ctg-yellow to-ctg-green rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-1000" />
          
          <div className="relative flex items-center bg-black/80 border border-white/10 rounded-[1.8rem] p-2 pr-3 shadow-2xl backdrop-blur-2xl">
            <div className="pl-4 text-white/30">
              {isLoading ? <Loader2 className="animate-spin text-ctg-yellow" size={20} /> : <LinkIcon size={20} />}
            </div>
            
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              placeholder={isLoading ? "Buscando información..." : "Pega el enlace de YouTube aquí..."}
              className="w-full bg-transparent border-none outline-none px-4 py-4 text-white text-lg placeholder:text-white/20 disabled:opacity-50"
            />
            
            <button
              type="submit"
              disabled={!url || isLoading}
              className={cn(
                "flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black transition-all duration-300 min-w-[160px] justify-center uppercase tracking-tighter",
                url && !isLoading
                  ? "bg-gradient-to-r from-ctg-red to-ctg-red/80 text-white shadow-[0_0_25px_rgba(206,17,38,0.4)] hover:scale-[1.02] active:scale-[0.98]" 
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>Descargar</span>
                </>
              )}
            </button>
          </div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-ctg-red shadow-[0_0_10px_#ce1126]" />
            Sin anuncios
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-ctg-yellow shadow-[0_0_10px_#fcd116]" />
            Calidad 4K
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-ctg-green shadow-[0_0_10px_#009b3a]" />
            Privacidad Total
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
