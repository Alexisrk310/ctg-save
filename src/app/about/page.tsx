'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Heart, Shield, Zap, Coffee, Code2, Globe } from 'lucide-react';

const values = [
  {
    icon: Zap,
    title: 'Eficiencia Sin Compromisos',
    description: 'Nuestra prioridad es la velocidad. Hemos optimizado cada línea de código para que obtengas lo que buscas en segundos.',
    color: 'text-yellow-500'
  },
  {
    icon: Shield,
    title: 'Privacidad Total',
    description: 'No rastreamos tus descargas ni almacenamos tus datos. Tu actividad en CTGSave es solo tuya.',
    color: 'text-green-500'
  },
  {
    icon: Heart,
    title: 'Hecho con Pasión',
    description: 'Nacido en Cartagena, CTGSave es un tributo a la cultura digital y a la libertad de contenido.',
    color: 'text-primary'
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navbar />
      
      <section className="pt-40 pb-24 px-4 overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block">
              Nuestra Historia
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
              Diseñado para los que <br /> <span className="premium-text-gradient">valoran su tiempo.</span>
            </h1>
            <p className="text-xl text-white/50 max-w-3xl mx-auto leading-relaxed">
              CTGSave nació de una necesidad simple: descargar contenido multimedia sin lidiar con 
              anuncios engañosos, esperas innecesarias o interfaces de hace una década.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-32">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${value.color}`}>
                  <value.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/10"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-8">El futuro de CTGSave</h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12">
                Estamos trabajando constantemente para añadir soporte a más plataformas y mejorar 
                la calidad de procesamiento. Nuestra meta es ser la herramienta definitiva para 
                salvaguardar tus recuerdos digitales.
              </p>
              
              <div className="flex flex-wrap justify-center gap-12 text-white/20">
                <div className="flex items-center gap-3">
                  <Coffee size={20} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Coffee Fueled</span>
                </div>
                <div className="flex items-center gap-3">
                  <Code2 size={20} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Open Source</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={20} />
                  <span>Cartagena, Colombia</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/5 blur-[120px] rounded-full" />
      </div>
    </main>
  );
}
