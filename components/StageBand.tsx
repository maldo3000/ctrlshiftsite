import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// Full-bleed photo band: the ASMBLY stage at Demo Room, with a slow parallax drift.
const StageBand: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[600px] max-h-[1100px] overflow-hidden bg-black">
      <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[10%]">
        <picture>
          <source srcSet="/assets/images/asmbly-stage.webp" type="image/webp" />
          <img
            src="/assets/images/asmbly-stage.jpg"
            alt="The ASMBLY stage at Demo Room: hosts in front of a giant title screen, a full room in silhouette"
            loading="lazy"
            decoding="async"
            width={2560}
            height={1707}
            className="w-full h-full object-cover object-[50%_30%]"
          />
        </picture>
      </motion.div>
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

      <div className="relative z-10 h-full container mx-auto px-5 sm:px-6 flex flex-col justify-end pb-14 sm:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-[#fe2e89] mb-4 sm:mb-6"
        >
          ASMBLY · 19 Nov 2026 · Demo Room, Toronto
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-5xl text-[2.6rem] sm:text-6xl lg:text-7xl font-syne font-semibold tracking-tight leading-[0.98]"
        >
          Talks, art and performance on one stage.
        </motion.h2>
        <motion.a
          href="/asmbly"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="group mt-8 sm:mt-10 inline-flex w-fit items-center gap-2 text-base sm:text-lg text-white hover:text-[#fe2e89] transition-colors"
        >
          See ASMBLY
          <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
        </motion.a>
      </div>
    </section>
  );
};

export default StageBand;
