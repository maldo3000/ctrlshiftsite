import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Mic2, BrainCircuit } from 'lucide-react';

const CtrlshiftCon: React.FC = () => {
  return (
    <section className="py-24 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20">
            <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-6xl md:text-8xl font-syne font-semibold tracking-tighter"
            >
                Ctrlshift Con
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-xl text-zinc-300 max-w-md mt-8 lg:mt-0 text-right font-light"
            >
                Expanding our format into a larger scale two day conference starting in Toronto, Spring 2026.
            </motion.p>
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
                <h3 className="text-2xl font-bold mb-4">The Concept</h3>
                <p className="text-zinc-400 leading-relaxed">
                    Creativity-driven tech conference that blends talks, workshops, and demos at a downtown arts venue with capacity for 800 attendees.
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
                    <Mic2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Talks and Panels</h3>
                <p className="text-zinc-400 leading-relaxed">
                    3 keynote speakers and 2 panels all focused on how generative AI is changing creative industries from filmmaking, advertising, design etc.
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
                    <BrainCircuit className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Workshops</h3>
                <p className="text-zinc-400 leading-relaxed">
                    Multi-hour workshops on generative AI workflows, creative vibe coding and more, from top experts in the field.
                </p>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtrlshiftCon;