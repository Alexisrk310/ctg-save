'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoMetadata, VideoFormat } from '@/types/video';
import { Play, Clock, Eye, Download, Music, Film } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VideoCardProps {
  metadata: VideoMetadata;
  onDownload: (format: VideoFormat) => void;
}

export const VideoCard = ({ metadata, onDownload }: VideoCardProps) => {
  const [tab, setTab] = React.useState<'video' | 'muted' | 'audio'>('video');

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto mt-12 glass rounded-[2.5rem] p-4 md:p-1 shadow-premium overflow-hidden border border-white/5"
    >
      <div className="flex flex-col lg:flex-row min-h-[480px]">
        {/* Left: Visual Anchor & Basic Info */}
        <div className="w-full lg:w-[340px] p-8 flex flex-col items-center lg:items-start space-y-8 bg-gradient-to-b from-white/[0.03] to-transparent">
          <div className="relative group w-full max-w-[280px] aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src={metadata.thumbnail}
              alt={metadata.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-[10px] font-black text-white border border-white/10 shadow-lg">
              {formatDuration(metadata.duration)}
            </div>
          </div>

          <div className="w-full space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Eye size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-white/30 leading-none mb-1">Visualizaciones</p>
                  <p className="text-sm font-bold text-white">{formatViews(metadata.views)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Clock size={16} className="text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-white/30 leading-none mb-1">Duración</p>
                  <p className="text-sm font-bold text-white">{formatDuration(metadata.duration)}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 text-center lg:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Detalles técnicos</span>
              <div className="mt-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 uppercase">
                  ID: {metadata.id}
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 uppercase">
                  Type: Dynamic
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Content & Downloads */}
        <div className="flex-1 p-8 md:p-12 flex flex-col">
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest shadow-sm">
                {metadata.author}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
                {metadata.platform}
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white leading-[1.1] tracking-tight max-w-2xl">
              {metadata.title}
            </h2>
          </div>

          <div className="flex-1 flex flex-col bg-white/[0.02] rounded-[2.5rem] p-8 border border-white/5 shadow-inner">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Opciones disponibles</h3>
              
              <div className="flex gap-1.5 p-1.5 bg-black/60 rounded-full border border-white/5 backdrop-blur-xl">
                <button
                  onClick={() => setTab('video')}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-2",
                    tab === 'video' ? "bg-white text-black shadow-xl scale-105" : "text-white/30 hover:text-white"
                  )}
                >
                  <Film size={12} />
                  Video
                </button>
                <button
                  onClick={() => setTab('muted')}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-2",
                    tab === 'muted' ? "bg-white text-black shadow-xl scale-105" : "text-white/30 hover:text-white"
                  )}
                >
                  <div className="relative">
                    <Film size={12} />
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-black" />
                  </div>
                  Mudo
                </button>
                <button
                  onClick={() => setTab('audio')}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-2",
                    tab === 'audio' ? "bg-white text-black shadow-xl scale-105" : "text-white/30 hover:text-white"
                  )}
                >
                  <Music size={12} />
                  Audio
                </button>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[400px] pr-3 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {metadata.formats
                  .filter(f => {
                    if (tab === 'video') return f.hasVideo && f.hasAudio;
                    if (tab === 'muted') return f.hasVideo && !f.hasAudio;
                    return !f.hasVideo && f.hasAudio;
                  })
                  .map((format, idx) => (
                    <motion.button
                      key={format.formatId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => onDownload(format)}
                      className="w-full flex items-center justify-between p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-primary/40 hover:bg-white/[0.07] transition-all group active:scale-[0.985] shadow-sm"
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[360deg]",
                          tab === 'video' ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(206,17,38,0.1)]" : 
                          tab === 'muted' ? "bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]" :
                          "bg-secondary/10 text-secondary shadow-[0_0_15px_rgba(252,209,22,0.1)]"
                        )}>
                          {(tab === 'video' || tab === 'muted') ? <Film size={22} /> : <Music size={22} />}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-black text-base tracking-tighter">{format.quality}</span>
                            {!format.hasAudio && tab === 'video' && (
                              <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 text-[9px] font-black uppercase border border-red-500/20 tracking-tighter">
                                Mudo
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] flex items-center gap-2">
                            <span>{format.extension}</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span>{format.filesize ? `${(format.filesize / (1024 * 1024)).toFixed(1)} MB` : 'Dynamic Size'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:border-white group-hover:scale-110 transition-all duration-300 shadow-2xl">
                        <Download size={18} className="text-white/40 group-hover:text-black" />
                      </div>
                    </motion.button>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
