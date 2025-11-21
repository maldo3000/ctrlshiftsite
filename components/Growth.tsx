import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const stats = [
    {
        val: "8",
        label: "Sold out Events in 2025",
        desc: "Each edition reached capacity within days of launch, reflecting the demand for spaces where creativity and technology intersect."
    },
    {
        val: "25+",
        label: "Speakers",
        desc: "A diverse lineup of artists, technologists, and innovators shaping the creative frontier. From AI filmmakers to product designers."
    },
    {
        val: "100+",
        label: "Attendees Per Event",
        desc: "Attendees include designers, developers, filmmakers, founders, and students. All contributing to an evolving creative ecosystem."
    },
    {
        val: "127K+",
        label: "Social Impressions",
        desc: "Our content and community stories reach tens of thousands across platforms. Each event sparks highlights that extend our message globally."
    }
];

const Growth: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 border-t border-white/10 bg-black">
      <div className="container mx-auto px-6">
        <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-7xl font-syne font-semibold mb-20 text-center md:text-left"
        >
            Growth
        </motion.h2>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    className="relative hover:bg-zinc-900/30 p-4 -m-4 rounded-lg transition-colors duration-500 text-center md:text-left"
                >
                    <div className="flex items-baseline gap-2 mb-6 justify-center md:justify-start">
                        <span className="text-6xl font-light tracking-tighter text-white">{stat.val}</span>
                    </div>
                    <div className="inline-block px-4 py-1 rounded-full border border-white/30 text-sm mb-6 font-medium">
                        {stat.label}
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                        {stat.desc}
                    </p>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Growth;