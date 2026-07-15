import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Video, Keyboard, MousePointer2, Lightbulb } from 'lucide-react';

const pillars = [
    {
        icon: <Video className="w-10 h-10" />,
        title: "Generative Storytelling",
        desc: "Exploring how creators use AI tools to craft new forms of image, motion, and narrative media."
    },
    {
        icon: <Keyboard className="w-10 h-10" />,
        title: "Next Gen Tools",
        desc: "Using AI tools to turn abstract ideas into interactive experiences. Apps as a medium of creative expression."
    },
    {
        icon: <MousePointer2 className="w-10 h-10" />,
        title: "Immersive/Interactive Media",
        desc: "Blending digital art, gaming, and spatial design to create immersive, multi-sensory worlds."
    },
    {
        icon: <Lightbulb className="w-10 h-10" />,
        title: "Culture & Philosophy",
        desc: "Speculating on where human imagination and machine intelligence intersect and what comes next."
    }
];

const ContentPillars: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 border-t border-white/10 bg-gradient-to-b from-transparent to-zinc-900/50">
      <div className="container mx-auto px-6">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Title Area */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="lg:col-span-1 text-center lg:text-left"
            >
                <h2 className="text-6xl md:text-7xl font-syne font-semibold tracking-tighter leading-none mb-8">
                    Content<br/>Pillars
                </h2>
                <div className="h-px w-24 bg-white mb-8 mx-auto lg:mx-0"></div>
                <p className="text-zinc-300 text-lg">
                    <span className="text-white font-bold">CTRL+SHIFT</span> talks and demos cover a range of subjects that usually fall within the scope of the following categories.
                </p>
            </motion.div>

            {/* Right Grid Area */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
                {pillars.map((pillar, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        whileHover={{ y: -5, backgroundColor: "rgba(24, 24, 27, 1)" }}
                        transition={{ duration: 0.3 }}
                        className="bg-zinc-950/90 p-10 transition-all duration-500 group backdrop-blur-sm cursor-pointer border border-transparent hover:border-white/5 relative z-10 text-center md:text-left"
                    >
                        <div className="mb-6 text-white group-hover:text-purple-400 transition-colors duration-300 group-hover:scale-110 origin-left md:origin-left transform flex justify-center md:justify-start">
                            {pillar.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-4">{pillar.title}</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            {pillar.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default ContentPillars;