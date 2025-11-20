import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const talks = [
    {
        name: "Nick St. Pierre",
        desc: "Spoke to us about the mindset behind creative output in a world of generative abundance.",
        img: "https://picsum.photos/seed/nick/600/400",
        color: "from-green-500/20 to-transparent"
    },
    {
        name: "Jay Allamar",
        role: "Director of Engineering @ Cohere",
        desc: "Spoke about the concept of LLM’s as a thought partner.",
        img: "https://picsum.photos/seed/jay/600/400",
        color: "from-purple-500/20 to-transparent"
    },
    {
        name: "Wilfred Lee",
        role: "@theartistjourney",
        desc: "Known as @theartistjourney on instagram, Wilfred introduced the next frontier of filmmaking.",
        img: "https://picsum.photos/seed/wilfred/600/400",
        color: "from-blue-500/20 to-transparent"
    },
    {
        name: "Amir Mot",
        role: "Founder & Educator",
        desc: "Founder and online AI educator spoke about using AI tools like cursor as the full stack for idea execution.",
        img: "https://picsum.photos/seed/amir/600/400",
        color: "from-yellow-500/20 to-transparent"
    }
];

const PreviousTalks: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 border-t border-white/10">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-syne font-semibold tracking-tighter mb-16"
        >
            Previous Talks
        </motion.h2>
        
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {talks.map((talk, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="group relative rounded-xl overflow-hidden bg-zinc-900/50 border border-white/10 hover:border-white/30 cursor-pointer"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                        <div className="h-64 sm:h-auto relative overflow-hidden">
                            <img 
                                src={talk.img} 
                                alt={talk.name} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-br ${talk.color} opacity-60`}></div>
                        </div>
                        <div className="p-8 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold mb-1 text-white">{talk.name}</h3>
                            {talk.role && <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">{talk.role}</p>}
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {talk.desc}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default PreviousTalks;