import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const items = [
    {
        id: 1,
        title: "Speaker Series",
        desc: "Sharing launch stories, techniques and creative breakthroughs."
    },
    {
        id: 2,
        title: "Networking Session",
        desc: "Designed to spark collaboration and meaningful friendships."
    },
    {
        id: 3,
        title: "Interactive Art Installations",
        desc: "Showcasing emerging artists and unique projects using the latest tech tools."
    },
    {
        id: 4,
        title: "Giveaways and Partner Activations",
        desc: "Connecting brands to audiences in an integrated way that keeps the energy high."
    }
];

const EventFormat: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="events" className="py-24 border-t border-white/10 relative">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Left Side */}
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-between"
        >
          <div>
            <h2 className="text-7xl md:text-8xl font-syne font-semibold tracking-tight mb-8">
              Event<br/>Format
            </h2>
            
            <div className="mt-12 rounded-2xl overflow-hidden relative aspect-video group cursor-pointer">
                 <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay z-10 transition-opacity group-hover:opacity-0"></div>
                 <img 
                   src="/assets/images/event-format.jpg" 
                   alt="Speaker presentation at CTRL+SHIFT" 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 />
            </div>
            
            <p className="mt-8 text-xl text-zinc-300 leading-relaxed">
              One Friday evening a month, 3-4 talks or creator showcases followed by networking and installations. It’s part conference, part showcase, part creative playground.
            </p>
          </div>
        </motion.div>

        {/* Right Side List */}
        <div className="flex flex-col justify-center space-y-8">
            {items.map((item, idx) => (
                <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + (idx * 0.1), duration: 0.6 }}
                    className={`flex gap-6 group p-6 rounded-xl transition-all duration-300 cursor-default ${hoveredId === item.id ? 'bg-white/5' : 'bg-transparent'}`}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                >
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full border flex items-center justify-center text-2xl font-light transition-all duration-300 ${hoveredId === item.id ? 'bg-white text-black border-white' : 'border-white/30 text-white'}`}>
                        {item.id}
                    </div>
                    <div className="pt-2">
                        <h3 className={`text-2xl font-bold mb-2 transition-colors ${hoveredId === item.id ? 'text-white' : 'text-zinc-200'}`}>{item.title}</h3>
                        <p className="text-zinc-400 text-lg">{item.desc}</p>
                    </div>
                </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
};

export default EventFormat;