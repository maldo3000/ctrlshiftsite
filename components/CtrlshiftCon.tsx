import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Wrench, Rocket, ArrowUpRight } from 'lucide-react';

const CtrlshiftCon: React.FC = () => {
  return (
    <section className="py-24 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-20">
            <div>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-6xl md:text-8xl font-syne font-semibold tracking-tighter"
                >
                    Academy
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-zinc-400 text-lg leading-relaxed max-w-2xl mt-6"
                >
                    AI information is everywhere. Practical skill is not. Academy is our answer:
                    hands-on, small-group workshops built for practitioners, from the community
                    behind 14 CTRL+SHIFT events.
                </motion.p>
            </div>

            <motion.a
                href="/academy/"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex shrink-0 items-center gap-2 px-8 py-4 text-lg font-syne font-bold bg-white text-black rounded-full transition-all duration-300 ease-out hover:bg-zinc-200 hover:scale-105 group"
            >
                Explore the Academy
                <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </motion.a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-white/20">
            {/* Item 1 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="p-12 border-b lg:border-b-0 lg:border-r border-white/20 flex flex-col items-center text-center group transition-colors duration-300"
            >
                <div className="w-20 h-20 rounded-full border border-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Understand the Concepts</h3>
                <p className="text-zinc-400 leading-relaxed">
                    Learn the principles, tools, and creative decisions behind the workflow before you begin — what matters, minus the noise of scattered tutorials.
                </p>
            </motion.div>

            {/* Item 2 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="p-12 border-b lg:border-b-0 lg:border-r border-white/20 flex flex-col items-center text-center group transition-colors duration-300"
            >
                <div className="w-20 h-20 rounded-full border border-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Wrench className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Build with Guidance</h3>
                <p className="text-zinc-400 leading-relaxed">
                    Work through a real project in a small group with live instruction, practical exercises, and help when you get stuck.
                </p>
            </motion.div>

            {/* Item 3 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="p-12 flex flex-col items-center text-center group transition-colors duration-300"
            >
                <div className="w-20 h-20 rounded-full border border-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Rocket className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Leave with Something Real</h3>
                <p className="text-zinc-400 leading-relaxed">
                    Finish the session with a completed piece or prototype, a repeatable process, and resources for continuing on your own.
                </p>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtrlshiftCon;
