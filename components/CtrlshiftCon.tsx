import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// Media is shared with the /asmbly landing page (public/asmbly/img).
const tiles = [
    { src: '/asmbly/img/dr-curtain.webp', alt: 'Visitor silhouetted inside an LED curtain installation at Demo Room', label: 'Installations' },
    { src: '/asmbly/img/dr-laser-crowd.webp', alt: 'Lasers cutting through haze over the Demo Room floor', label: 'Live AV & music' },
];

const CtrlshiftCon: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Only pull the reel once it's on screen, and pause it when it isn't. Plays
  // straight from the observer callback (not via React state) so a fast scroll
  // past (in → out → in) can't get batched into one render and leave it paused.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
            <div>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-sm uppercase tracking-[0.2em] text-purple-400 mb-6"
                >
                    CTRL+SHIFT × Demo Room × Sky Fine Foods
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-6xl md:text-8xl font-syne font-semibold tracking-tighter"
                >
                    {/* ASMBLY wordmark: alternate letters drop below the baseline, as on /asmbly */}
                    <span aria-label="ASMBLY">
                        A<span className="inline-block translate-y-[0.17em]">S</span>M<span className="inline-block translate-y-[0.17em]">B</span>L<span className="inline-block translate-y-[0.17em]">Y</span>
                    </span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-zinc-400 text-lg leading-relaxed max-w-2xl mt-6"
                >
                    Our first conference: ASMBLY, a night of talks, art and performance at Demo
                    Room in Toronto, with art curated by Sky Fine Foods.
                </motion.p>
            </div>

            <motion.a
                href="/asmbly"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex shrink-0 items-center gap-2 px-8 py-4 text-lg font-syne font-bold bg-white text-black rounded-full transition-all duration-300 ease-out hover:bg-zinc-200 hover:scale-105 group"
            >
                Explore ASMBLY
                <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </motion.a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4">
            <motion.a
                href="/asmbly"
                aria-label="ASMBLY at Demo Room"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-2 lg:row-span-2 relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 group"
            >
                <video
                    ref={videoRef}
                    src="/asmbly/img/hero-reel.mp4"
                    poster="/asmbly/img/hero-reel-poster.jpg"
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
                <div className="absolute top-5 left-5 right-5 flex justify-between items-center text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-200">
                    <span>19.11.2026</span>
                    <span>Toronto</span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 flex justify-between items-end gap-6">
                    <span className="text-2xl sm:text-4xl font-syne font-semibold tracking-tight">ASMBLY</span>
                    <span className="flex flex-col items-end gap-2">
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-zinc-400">Presented by</span>
                        <img src="/asmbly/img/demoroom-logo.png?v=3" alt="Demo Room" className="h-3 sm:h-4 w-auto" loading="lazy" />
                    </span>
                </div>
            </motion.a>

            {tiles.map((tile, i) => (
                <motion.a
                    key={tile.src}
                    href="/asmbly"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="relative aspect-[4/3] lg:aspect-auto rounded-2xl overflow-hidden bg-zinc-900 group"
                >
                    <img
                        src={tile.src}
                        alt={tile.alt}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 right-4 text-base sm:text-xl font-syne font-semibold tracking-tight">
                        {tile.label}
                    </span>
                </motion.a>
            ))}
        </div>
      </div>
    </section>
  );
};

export default CtrlshiftCon;
