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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto mt-8 glass rounded-[2rem] p-6 shadow-premium overflow-hidden border border-white/5"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Simple Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-4">
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-lg aspect-video">
            <img
              src={metadata.thumbnail}
              alt={metadata.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-black text-white">
              {formatDuration(metadata.duration)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[8px] uppercase font-black text-white/30 mb-0.5">Vistas</p>
              <p className="text-xs font-bold text-white">{formatViews(metadata.views)}</p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[8px] uppercase font-black text-white/30 mb-0.5">Duración</p>
              <p className="text-xs font-bold text-white">{formatDuration(metadata.duration)}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-md bg-ctg-red/10 text-ctg-red text-[9px] font-black uppercase tracking-wider border border-ctg-red/20">
                {metadata.author}
              </span>
              <span className="px-3 py-1 rounded-md bg-ctg-yellow/10 text-ctg-yellow text-[9px] font-black uppercase tracking-wider border border-ctg-yellow/20">
                {metadata.platform}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white truncate pr-4">
              {metadata.title}
            </h2>
          </div>

          <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex gap-1 p-1 bg-black/60 rounded-xl border border-white/5">
                <button
                  onClick={() => setTab('video')}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2",
                    tab === 'video' ? "bg-white text-black shadow-md" : "text-white/30 hover:text-white"
                  )}
                >
                  <Film size={12} />
                  Video
                </button>
                <button
                  onClick={() => setTab('muted')}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2",
                    tab === 'muted' ? "bg-white text-black shadow-md" : "text-white/30 hover:text-white"
                  )}
                >
                  <Film size={12} className="text-ctg-red" />
                  Mudo
                </button>
                <button
                  onClick={() => setTab('audio')}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2",
                    tab === 'audio' ? "bg-white text-black shadow-md" : "text-white/30 hover:text-white"
                  )}
                >
                  <Music size={12} />
                  Audio
                </button>
              </div>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
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
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onDownload(format)}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-ctg-green/40 hover:bg-white/[0.05] transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                          tab === 'video' ? "bg-ctg-red/10 text-ctg-red" : 
                          tab === 'muted' ? "bg-ctg-red/20 text-ctg-red" :
                          "bg-ctg-yellow/10 text-ctg-yellow"
                        )}>
                          {(tab === 'video' || tab === 'muted') ? <Film size={18} /> : <Music size={18} />}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{format.quality}</span>
                            <span className="text-[9px] text-white/20 uppercase font-black">{format.extension}</span>
                          </div>
                          <p className="text-[9px] text-white/30 font-bold uppercase">
                            {format.filesize ? `${(format.filesize / (1024 * 1024)).toFixed(1)} MB` : 'Dynamic'}
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-ctg-green group-hover:border-ctg-green transition-all">
                        <Download size={14} className="text-white/40 group-hover:text-black" />
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
