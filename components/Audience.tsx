import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const data = [
  { name: 'Creative Professional', value: 60, color: '#34D399' }, // Emerald-400
  { name: 'Developers', value: 40, color: '#38BDF8' }, // Sky-400
];

const tableData = [
  { role: 'Art / Creative Director', pct: '31%', company: 'Freelance', compPct: '37%' },
  { role: 'Indie Filmmaker', pct: '18%', company: 'Startup (10-100)', compPct: '29%' },
  { role: 'UX / Product', pct: '19%', company: 'Agency', compPct: '24%' },
  { role: 'Creative Coder', pct: '28%', company: 'Enterprise (>100)', compPct: '10%' },
];

const Audience: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="audience" className="py-24 border-t border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Stats & Chart */}
          <div className="space-y-12">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-7xl font-syne font-semibold tracking-tighter"
            >
                Audience
            </motion.h2>
            
            <div>
                <h3 className="text-3xl font-medium mb-8">Who Shows Up?</h3>
                
                {/* Legend */}
                <div className="flex items-center gap-6 mb-10">
                    <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span className="text-zinc-300 text-sm">Creative Professional</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-sky-400"></div>
                    <span className="text-zinc-300 text-sm">Developers</span>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-8 items-center">
                    {/* Stats List */}
                    <div className="flex-1 space-y-10">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-6xl font-bold text-emerald-400 font-sans">60%</span>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                                Creative professionals (designers, filmmakers, artists, producers) experimenting with or curious about next gen creative tools.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                             <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-6xl font-bold text-sky-400 font-sans">40%</span>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                                Developers, creative technologists and technical folks, using AI tools to create new experiences.
                            </p>
                        </motion.div>
                    </div>

                    {/* Pie Chart - Compact and next to stats */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="w-64 h-64 flex-shrink-0 hidden xl:block relative"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center decorative element */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-24 h-24 rounded-full bg-white/5 blur-2xl"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
          </div>

          {/* Right Column: Table */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full h-full flex flex-col justify-center"
          >
             <div className="border border-zinc-800 rounded-xl overflow-hidden bg-black/40 shadow-2xl backdrop-blur-xl">
                <div className="grid grid-cols-2 border-b border-zinc-800 bg-white/5">
                    <div className="p-6 font-bold text-white text-sm uppercase tracking-wider">Roles</div>
                    <div className="p-6 font-bold text-white border-l border-zinc-800 text-sm uppercase tracking-wider">Company Types</div>
                </div>
                
                <div className="divide-y divide-zinc-800">
                    {tableData.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-2 hover:bg-white/5 transition-colors group">
                            <div className="p-5 flex items-center justify-between gap-4">
                                <span className="text-zinc-300 font-medium group-hover:text-white transition-colors text-sm sm:text-base">{row.role}</span>
                                <span className="text-emerald-400 font-mono font-bold text-sm">{row.pct}</span>
                            </div>
                            <div className="p-5 border-l border-zinc-800 flex items-center justify-between gap-4">
                                <span className="text-zinc-300 font-medium group-hover:text-white transition-colors text-sm sm:text-base">{row.company}</span>
                                <span className="text-sky-400 font-mono font-bold text-sm">{row.compPct}</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
             <p className="text-[10px] text-zinc-500 mt-4 italic text-right">*Results approximate from post-event google form surveys from 2025 events</p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Audience;