
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, BookOpen, Users } from 'lucide-react';

const steps = [
    {
        icon: <MapPin className="w-10 h-10" />,
        title: "New Markets",
        desc: "Launching a meetup in LA and NYC with onsite producers to move the brand beyond local reach."
    },
    {
        icon: <Globe className="w-10 h-10" />,
        title: "Media",
        desc: "Expanding online media presence, creating news and educational content around a trusted brand."
    },
    {
        icon: <BookOpen className="w-10 h-10" />,
        title: "Education",
        desc: "Plans to host quarterly workshops on topics ranging from vibe coding to AI filmmaking."
    },
    {
        icon: <Users className="w-10 h-10" />,
        title: "Conference",
        desc: "An annual flagship conference featuring the world’s leading thinkers in the space."
    }
];

const ExpansionPlan: React.FC = () => {
  return (
    <section id="expansion" className="py-32 border-t border-white/10 bg-gradient-to-b from-black to-zinc-900">
      <div className="container mx-auto px-6 text-center">
        <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-syne font-semibold tracking-tighter mb-24"
        >
            What's next?
        </motion.h2>

        <div className="relative">
            {/* Horizontal Line */}
            <div className="hidden lg:block absolute top-12 left-10 right-10 h-px bg-white/20 -z-10"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {steps.map((step, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15, duration: 0.6 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-black border border-white flex items-center justify-center mb-8 hover:scale-110 transition-transform duration-300 hover:bg-white hover:text-black group shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <div className="text-white group-hover:text-black transition-colors">
                                {step.icon}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                        <p className="text-zinc-400 text-sm max-w-xs">
                            {step.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default ExpansionPlan;