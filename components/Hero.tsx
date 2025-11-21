
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import TubesBackground from './TubesBackground';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden bg-black">
      {/* Background Interactive Tubes */}
      <div className="absolute inset-0 z-0 opacity-80">
        <TubesBackground />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center relative z-10 pointer-events-none">
        
        <div className="pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-syne font-extrabold tracking-[-0.05em] leading-[1.1] mb-6 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] uppercase">
              CTRL<br/>+ SHIFT
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-px bg-gradient-to-r from-white to-transparent my-8 max-w-md"
          />

          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-3xl md:text-5xl font-sans font-semibold leading-tight mb-8 text-zinc-100"
          >
            Where creativity meets <br/>
            <span className="font-bold text-white">emerging technology.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-zinc-400 max-w-lg text-lg leading-relaxed mb-10"
          >
            Calling artists, designers, filmmakers, musicians, and developers who see technology as a tool for expanding their creative horizons and amplifying the human touch in art.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
             <a 
               href="https://luma.com/ctrlshift?k=c"
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center justify-center px-8 py-4 text-lg font-syne font-bold text-white transition-all duration-300 ease-out bg-purple-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:bg-purple-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] gap-2 group"
             >
                Upcoming Events
                <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
             </a>
          </motion.div>
        </div>

        {/* Abstract visual element on the right for desktop */}
        <motion.div 
          style={{ y: y1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative hidden lg:block h-full w-full pointer-events-auto"
        >
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20"></div>
           <img 
              src="/assets/images/hero-image.jpg" 
              alt="Speaker at CTRL+SHIFT"
              className="w-full h-full object-cover rounded-2xl opacity-80 hover:opacity-100 transition-all duration-700"
           />
        </motion.div>
      </div>

      <motion.a
         href="https://www.instagram.com/ctrlshift_ai/"
         target="_blank"
         rel="noopener noreferrer"
         style={{ y: y2 }}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 2, duration: 1 }}
         className="absolute bottom-10 right-10 hidden md:flex items-center gap-2 text-white pointer-events-auto z-50 hover:text-zinc-300 transition-colors cursor-pointer"
      >
        <span>@ctrlshift_ai</span>
        <ArrowRight className="w-4 h-4" />
      </motion.a>
    </section>
  );
};

export default Hero;
