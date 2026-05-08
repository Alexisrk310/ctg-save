'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { VideoCard } from '@/components/VideoCard';
import { VideoMetadata, VideoFormat } from '@/types/video';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (metadata && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [metadata]);

  const handleFetchInfo = async (url: string) => {
    setLoading(true);
    setMetadata(null);
    
    try {
      const response = await axios.post('/api/video/info', { url });
      setMetadata(response.data);
      toast.success('¡Video encontrado!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || 'No se pudo obtener la información del video.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: VideoFormat) => {
    if (!metadata || !format.url) {
      toast.error('No se pudo encontrar la URL de descarga para este formato.');
      return;
    }
    
    toast.info(`Iniciando descarga de "${metadata.title}" (${format.quality})...`);
    
    const filename = `${metadata.title}.${format.extension}`.replace(/[<>:"/\\|?*]/g, '_');
    const downloadUrl = `/api/video/download?url=${encodeURIComponent(format.url)}&filename=${encodeURIComponent(filename)}`;
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Toaster position="bottom-right" theme="dark" />
      <Navbar />
      
      <Hero onDownload={handleFetchInfo} />


      <div ref={resultsRef} className="container mx-auto px-4 pb-24 scroll-mt-24">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-white/40 font-medium animate-pulse">Analizando video...</p>
            </motion.div>
          )}

          {metadata && !loading && (
            <motion.div
              key="metadata"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
              <VideoCard 
                metadata={metadata} 
                onDownload={handleDownload} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features removed as requested */}

      {/* Subtle Footer Decorations */}
      <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
    </main>
  );
}
