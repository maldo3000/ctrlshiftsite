
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import RevealImage from './RevealImage';
import { ASSETS } from '../utils/assets';

const WhoWeAre: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="who-we-are" className="py-24 border-t border-white/10">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-6xl md:text-8xl font-syne font-semibold tracking-tight mb-4">Who We Are</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative group cursor-pointer"
          >
            {/* Glow effect matching the blue vibe */}
            <div className="absolute inset-0 bg-blue-600/30 blur-3xl -z-10 group-hover:bg-blue-500/50 transition-all duration-700 opacity-60"></div>
            
            {/* Main Image using the new System */}
            <div className="rounded-lg overflow-hidden shadow-2xl border border-white/10 group-hover:shadow-blue-900/50 transition-shadow duration-500">
                <RevealImage
                  src={ASSETS.whoWeAre.hero}
                  alt="Event crowd watching projection"
                  className="w-full h-[500px] group-hover:scale-[1.03] transition-transform duration-700"
                />
            </div>
            
            {/* Decorative overlay for extra texture */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 to-transparent opacity-60 pointer-events-none"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col justify-center space-y-8"
          >
            <h3 className="text-4xl md:text-5xl font-semibold leading-tight">
              Eight sold-out editions in 2025. A growing network of artists & developers shaping what’s next.
            </h3>
            
            <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
              <p>
                A monthly creative-tech event series exploring how AI is transforming art, design, and storytelling.
              </p>
              <p>
                We bring together forward-thinking creators, founders, and technologists for talks, installations, and community connection.
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Additional images row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
             {ASSETS.whoWeAre.grid.map((src, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + (i * 0.1), duration: 0.6 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="overflow-hidden rounded border border-white/5 relative group h-64"
                 >
                     <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
                     <RevealImage 
                        src={src} 
                        alt="Event atmosphere" 
                        className="w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:contrast-110"
                     />
                 </motion.div>
             ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
