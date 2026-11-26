
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-20 pb-10 overflow-hidden bg-black">
      {/* Full-bleed hero photo (ASMBLY, Demo Room): fills the viewport, eases in, drifts on scroll */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: [0.2, 0.7, 0.2, 1] }}
          className="absolute inset-0"
        >
          <picture>
            <source srcSet="/assets/images/asmbly-hero.webp" type="image/webp" />
            <img
              src="/assets/images/asmbly-hero.jpg"
              alt="A packed room at ASMBLY, watching the stage beside a glowing LED installation"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={2000}
              height={1334}
              className="w-full h-full object-cover object-[60%_40%]"
            />
          </picture>
        </motion.div>
        {/* Legibility: dark on the text side, a top band for the nav and a long fade into the page */}
        <div className="absolute inset-0 bg-black/55 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/90 lg:via-black/45 lg:to-black/5"></div>
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </motion.div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10 pointer-events-none">

        <div className="pointer-events-auto max-w-3xl">
          {/* ASMBLY announcement */}
          <motion.a
            href="/asmbly"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group inline-flex max-w-full items-center gap-3 mb-8 sm:mb-10 pl-2 pr-4 py-2 rounded-full border border-[#fe2e89]/50 bg-black/60 backdrop-blur-sm text-sm sm:text-base text-white hover:border-[#fe2e89] hover:bg-[#fe2e89]/10 transition-colors"
          >
            <span className="shrink-0 rounded-full bg-[#fe2e89] px-2.5 py-0.5 text-xs sm:text-sm font-syne font-bold text-black">Past event</span>
            <span className="truncate">
              <span className="font-syne font-bold">ASMBLY</span>
              <span className="text-zinc-400"> · 19 Nov · Toronto<span className="hidden sm:inline"> · Recap coming soon</span></span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0 text-[#fe2e89] group-hover:translate-x-0.5 transition-transform" />
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-10 sm:mb-12">
              <img
                src="/assets/images/logo-wordmark.png"
                alt="CTRL + SHIFT"
                className="w-full max-w-xl lg:max-w-2xl h-auto drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
              />
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-px bg-gradient-to-r from-white to-transparent my-6 sm:my-8 max-w-md"
          />

          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-[2.6rem] sm:text-6xl xl:text-7xl font-sans font-semibold leading-[1.05] tracking-tight mb-6 sm:mb-8 text-zinc-100"
          >
            Signals for <br/>
            <span className="font-bold text-white">creative intelligence.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-zinc-300 max-w-xl text-base sm:text-xl leading-relaxed mb-8 sm:mb-10"
          >
            Calling all creatives, creators, entrepreneurs, founders, artists, and designers who see technology as a tool for building what's next, without losing the human touch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4"
          >
             <a
               href="/asmbly"
               className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 text-lg font-syne font-bold text-black transition-all duration-300 ease-out bg-[#fe2e89] rounded-full shadow-[0_0_25px_rgba(254,46,137,0.35)] hover:bg-white hover:scale-105 gap-2 group"
             >
                Check out ASMBLY
                <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
             </a>
             <a 
               href="https://luma.com/ctrlshift?k=c"
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 text-lg font-syne font-bold text-white transition-all duration-300 ease-out bg-purple-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:bg-purple-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] gap-2 group"
             >
                Community Calendar
                <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
             </a>
          </motion.div>
        </div>

      </div>

      <motion.a
         href="https://www.instagram.com/ctrlshift.to/"
         target="_blank"
         rel="noopener noreferrer"
         style={{ y: y2 }}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 2, duration: 1 }}
         className="absolute bottom-10 right-10 hidden md:flex items-center gap-2 text-white pointer-events-auto z-50 hover:text-zinc-300 transition-colors cursor-pointer"
      >
        <span>@ctrlshift.to</span>
        <ArrowRight className="w-4 h-4" />
      </motion.a>
    </section>
  );
};

export default Hero;
