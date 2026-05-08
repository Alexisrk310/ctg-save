'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Star, HardDrive, Smartphone, Globe } from 'lucide-react';

const features = [
  {
    title: 'Velocidad Extrema',
    description: 'Procesamiento instantáneo gracias a nuestro backend optimizado con yt-dlp.',
    icon: Zap,
    color: 'text-yellow-500',
  },
  {
    title: '100% Seguro',
    description: 'Sin anuncios intrusivos ni software malicioso. Tu privacidad es lo primero.',
    icon: ShieldCheck,
    color: 'text-green-500',
  },
  {
    title: 'Calidad Premium',
    description: 'Descarga videos en 4K, 1080p y audio de alta fidelidad (320kbps).',
    icon: Star,
    color: 'text-primary',
  },
  {
    title: 'Multi-Plataforma',
    description: 'Soporte inicial para YouTube, con TikTok e Instagram en camino.',
    icon: Globe,
    color: 'text-blue-500',
  },
  {
    title: 'Sin Límites',
    description: 'Descargas ilimitadas de cualquier duración sin restricciones de cuenta.',
    icon: HardDrive,
    color: 'text-purple-500',
  },
  {
    title: 'Diseño Responsive',
    description: 'Funciona perfectamente en cualquier dispositivo, móvil o escritorio.',
    icon: Smartphone,
    color: 'text-pink-500',
  }
];

export const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">¿Por qué elegir CTGSave?</h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Hemos diseñado la herramienta de descarga más limpia y rápida del mercado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all group hover:bg-white/[0.07]"
            >
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
