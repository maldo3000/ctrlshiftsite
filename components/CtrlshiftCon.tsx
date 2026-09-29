import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CtrlshiftCon: React.FC = () => {
  return (
    <section className="py-24 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-sm uppercase tracking-[0.2em] text-purple-400 mb-6"
                >
                    Night Con · Presented by Demo Room
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-6xl md:text-8xl font-syne font-semibold tracking-tighter"
                >
                    CTRL+SHIFT Conference
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-zinc-400 text-lg leading-relaxed max-w-2xl mt-6"
                >
                    We're building our first conference: a night of talks, installations and
                    live AV, developed with Demo Room in Toronto.
                </motion.p>
            </div>

            <motion.a
                href="/con"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex shrink-0 items-center gap-2 px-8 py-4 text-lg font-syne font-bold bg-white text-black rounded-full transition-all duration-300 ease-out hover:bg-zinc-200 hover:scale-105 group"
            >
                See the Conference
                <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </motion.a>
        </div>
      </div>
    </section>
  );
};

export default CtrlshiftCon;
