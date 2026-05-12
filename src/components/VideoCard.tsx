'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoMetadata, VideoFormat } from '@/types/video';
import { Download, Music, Film, Eye, Clock, Sparkles } from 'lucide-react';
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

  const tabConfig = {
    video: { color: '#ce1126', label: 'Video', icon: Film, bg: 'rgba(206,17,38,0.15)', border: 'rgba(206,17,38,0.4)' },
    muted: { color: '#fcd116', label: 'Mudo', icon: Film, bg: 'rgba(252,209,22,0.12)', border: 'rgba(252,209,22,0.4)' },
    audio: { color: '#009b3a', label: 'Audio', icon: Music, bg: 'rgba(0,155,58,0.15)', border: 'rgba(0,155,58,0.4)' },
  };

  const currentTab = tabConfig[tab];

  // Determine quality tier color
  const getQualityColor = (quality: string) => {
    if (quality.includes('1080') || quality.includes('1440') || quality.includes('2160') || quality.includes('4K'))
      return { accent: '#ce1126', bg: 'rgba(206,17,38,0.12)', label: 'HD+' };
    if (quality.includes('720'))
      return { accent: '#fcd116', bg: 'rgba(252,209,22,0.10)', label: 'HD' };
    return { accent: '#009b3a', bg: 'rgba(0,155,58,0.10)', label: 'SD' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      className="w-full max-w-4xl mx-auto mt-8 relative"
    >

      {/* Main card */}
      <div className="relative rounded-[2rem] p-6 overflow-hidden" style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(16px)' }}>
        {/* Inner ambient glow — top left */}
        <div
          className="absolute top-0 left-0 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${currentTab.color}20 0%, transparent 70%)`,
            filter: 'blur(60px)',
            transition: 'background 0.5s ease',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          {/* Sidebar — Thumbnail & Stats */}
          <div className="w-full md:w-64 flex flex-col gap-4">
            {/* Thumbnail */}
            <div className="relative group rounded-2xl overflow-hidden shadow-2xl aspect-video"
              style={{ border: `1px solid ${currentTab.color}30` }}
            >
              <img
                src={metadata.thumbnail}
                alt={metadata.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg text-[10px] font-black text-white flex items-center gap-1"
                style={{ background: 'rgba(0,0,0,0.85)', border: `1px solid ${currentTab.color}40` }}
              >
                <Clock size={10} style={{ color: currentTab.color }} />
                {formatDuration(metadata.duration)}
              </div>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="px-3 py-2.5 rounded-xl transition-all"
                style={{
                  background: 'rgba(206,17,38,0.06)',
                  border: '1px solid rgba(206,17,38,0.15)',
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Eye size={10} style={{ color: '#ce1126' }} />
                  <p className="text-[8px] uppercase font-black" style={{ color: 'rgba(206,17,38,0.6)' }}>Vistas</p>
                </div>
                <p className="text-sm font-bold text-white">{formatViews(metadata.views)}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="px-3 py-2.5 rounded-xl transition-all"
                style={{
                  background: 'rgba(0,155,58,0.06)',
                  border: '1px solid rgba(0,155,58,0.15)',
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock size={10} style={{ color: '#009b3a' }} />
                  <p className="text-[8px] uppercase font-black" style={{ color: 'rgba(0,155,58,0.6)' }}>Duración</p>
                </div>
                <p className="text-sm font-bold text-white">{formatDuration(metadata.duration)}</p>
              </motion.div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider"
                  style={{
                    background: 'rgba(206,17,38,0.12)',
                    color: '#ce1126',
                    border: '1px solid rgba(206,17,38,0.25)',
                    boxShadow: '0 0 12px rgba(206,17,38,0.1)',
                  }}
                >
                  {metadata.author}
                </span>
                <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider"
                  style={{
                    background: 'rgba(252,209,22,0.10)',
                    color: '#fcd116',
                    border: '1px solid rgba(252,209,22,0.25)',
                    boxShadow: '0 0 12px rgba(252,209,22,0.08)',
                  }}
                >
                  {metadata.platform}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white truncate pr-4 leading-tight">
                {metadata.title}
              </h2>
            </div>

            {/* Format Selector Panel */}
            <div className="rounded-2xl p-4 transition-all duration-500"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: `1px solid ${currentTab.color}15`,
              }}
            >
              {/* Tab Switcher */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1 p-1 rounded-xl"
                  style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {(Object.keys(tabConfig) as Array<'video' | 'muted' | 'audio'>).map((key) => {
                    const cfg = tabConfig[key];
                    const isActive = tab === key;
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setTab(key)}
                        className="relative px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2"
                        style={{
                          background: isActive ? cfg.color : 'transparent',
                          color: isActive ? (key === 'muted' ? '#000' : '#fff') : 'rgba(255,255,255,0.3)',
                          boxShadow: isActive ? `0 0 20px ${cfg.color}40` : 'none',
                        }}
                      >
                        <Icon size={12} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format List */}
              <div className="space-y-2 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {metadata.formats
                    .filter(f => {
                      if (tab === 'video') return f.hasVideo && f.hasAudio;
                      if (tab === 'muted') return f.hasVideo && !f.hasAudio;
                      return !f.hasVideo && f.hasAudio;
                    })
                    .map((format, idx) => {
                      const qc = tab === 'audio'
                        ? { accent: '#009b3a', bg: 'rgba(0,155,58,0.08)', label: '♪' }
                        : getQualityColor(format.quality);

                      return (
                        <motion.button
                          key={format.formatId}
                          layout
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04, type: 'spring', damping: 20 }}
                          onClick={() => onDownload(format)}
                          className="w-full flex items-center justify-between p-3.5 rounded-xl transition-all group active:scale-[0.98] cursor-pointer"
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            borderLeft: `3px solid ${qc.accent}50`,
                            borderTop: '1px solid rgba(255,255,255,0.04)',
                            borderRight: '1px solid rgba(255,255,255,0.04)',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${qc.accent}10`;
                            e.currentTarget.style.borderLeftColor = qc.accent;
                            e.currentTarget.style.boxShadow = `inset 3px 0 12px ${qc.accent}15, 0 0 20px ${qc.accent}08`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            e.currentTarget.style.borderLeftColor = `${qc.accent}50`;
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                              style={{
                                background: qc.bg,
                                border: `1px solid ${qc.accent}20`,
                              }}
                            >
                              {(tab === 'video' || tab === 'muted')
                                ? <Film size={18} style={{ color: qc.accent }} />
                                : <Music size={18} style={{ color: qc.accent }} />
                              }
                            </div>
                            {/* Info */}
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white">{format.quality}</span>
                                <span
                                  className="text-[8px] uppercase font-black px-1.5 py-0.5 rounded"
                                  style={{
                                    background: `${qc.accent}15`,
                                    color: qc.accent,
                                  }}
                                >
                                  {format.extension}
                                </span>
                                {tab !== 'audio' && (
                                  <span
                                    className="text-[7px] uppercase font-black px-1.5 py-0.5 rounded-full"
                                    style={{
                                      background: `${qc.accent}10`,
                                      color: `${qc.accent}90`,
                                      border: `1px solid ${qc.accent}20`,
                                    }}
                                  >
                                    {qc.label}
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] text-white/30 font-bold uppercase mt-0.5">
                                {format.filesize ? `${(format.filesize / (1024 * 1024)).toFixed(1)} MB` : 'Tamaño dinámico'}
                              </p>
                            </div>
                          </div>

                          {/* Download Button */}
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                            style={{
                              border: `1.5px solid ${qc.accent}30`,
                              background: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = qc.accent;
                              e.currentTarget.style.borderColor = qc.accent;
                              e.currentTarget.style.boxShadow = `0 0 16px ${qc.accent}50`;
                              const icon = e.currentTarget.querySelector('svg');
                              if (icon) (icon as SVGSVGElement).style.color = '#000';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderColor = `${qc.accent}30`;
                              e.currentTarget.style.boxShadow = 'none';
                              const icon = e.currentTarget.querySelector('svg');
                              if (icon) (icon as SVGSVGElement).style.color = `${qc.accent}`;
                            }}
                          >
                            <Download size={14} style={{ color: qc.accent, transition: 'color 0.3s' }} />
                          </div>
                        </motion.button>
                      );
                    })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
