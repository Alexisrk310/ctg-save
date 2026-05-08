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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mt-12 relative"
    >
      {/* Background Decorative Glows */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-ctg-red/20 blur-[80px] rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-ctg-green/20 blur-[80px] rounded-full" />

      <div className="relative glass rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
        {/* Cartagena Flag Top Accent */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-ctg-red" />
          <div className="flex-1 bg-ctg-yellow" />
          <div className="flex-1 bg-ctg-green" />
        </div>

        <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10">
          {/* Visual Side */}
          <div className="w-full md:w-72 shrink-0 space-y-6">
            <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video bg-black/40">
              <img
                src={metadata.thumbnail}
                alt={metadata.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-[10px] font-black text-white border border-white/10">
                {formatDuration(metadata.duration)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                <span className="text-[9px] uppercase font-black text-white/20 tracking-widest mb-1">Vistas</span>
                <span className="text-sm font-bold text-white">{formatViews(metadata.views)}</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                <span className="text-[9px] uppercase font-black text-white/20 tracking-widest mb-1">Duración</span>
                <span className="text-sm font-bold text-white">{formatDuration(metadata.duration)}</span>
              </div>
            </div>
          </div>

          {/* Info Side */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 rounded-full bg-ctg-red/10 text-ctg-red text-[10px] font-black uppercase tracking-widest border border-ctg-red/20">
                  {metadata.author}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-ctg-yellow/10 text-ctg-yellow text-[10px] font-black uppercase tracking-widest border border-ctg-yellow/20">
                  {metadata.platform}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
                {metadata.title}
              </h2>
            </div>

            <div className="bg-white/[0.02] rounded-[2rem] p-6 border border-white/5 shadow-inner">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-xl">
                  <button
                    onClick={() => setTab('video')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-[11px] font-black uppercase transition-all flex items-center gap-2.5",
                      tab === 'video' ? "bg-ctg-red text-white shadow-[0_0_15px_rgba(206,17,38,0.3)] scale-105" : "text-white/20 hover:text-white"
                    )}
                  >
                    <Film size={14} />
                    Video
                  </button>
                  <button
                    onClick={() => setTab('muted')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-[11px] font-black uppercase transition-all flex items-center gap-2.5",
                      tab === 'muted' ? "bg-ctg-yellow text-black shadow-[0_0_15px_rgba(252,209,22,0.3)] scale-105" : "text-white/20 hover:text-white"
                    )}
                  >
                    <Film size={14} />
                    Mudo
                  </button>
                  <button
                    onClick={() => setTab('audio')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-[11px] font-black uppercase transition-all flex items-center gap-2.5",
                      tab === 'audio' ? "bg-ctg-green text-white shadow-[0_0_15px_rgba(0,155,58,0.3)] scale-105" : "text-white/20 hover:text-white"
                    )}
                  >
                    <Music size={14} />
                    Audio
                  </button>
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[320px] pr-3 custom-scrollbar">
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
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => onDownload(format)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all group active:scale-[0.98] relative overflow-hidden"
                      >
                        {/* Hover Gradient Accent */}
                        <div className={cn(
                          "absolute inset-y-0 left-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity",
                          tab === 'video' ? "bg-ctg-red" : tab === 'muted' ? "bg-ctg-yellow" : "bg-ctg-green"
                        )} />

                        <div className="flex items-center gap-5">
                          <div className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500",
                            tab === 'video' ? "bg-ctg-red/10 text-ctg-red" : 
                            tab === 'muted' ? "bg-ctg-yellow/10 text-ctg-yellow" :
                            "bg-ctg-green/10 text-ctg-green"
                          )}>
                            {(tab === 'video' || tab === 'muted') ? <Film size={20} /> : <Music size={20} />}
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2.5">
                              <span className="font-black text-base text-white tracking-tight">{format.quality}</span>
                              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-black text-white/40 uppercase tracking-tighter">
                                {format.extension}
                              </span>
                            </div>
                            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-0.5">
                              {format.filesize ? `${(format.filesize / (1024 * 1024)).toFixed(1)} MB` : 'Tamaño Dinámico'}
                            </p>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:border-white transition-all duration-300 shadow-xl group-hover:scale-110">
                          <Download size={16} className="text-white/40 group-hover:text-black" />
                        </div>
                      </motion.button>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
