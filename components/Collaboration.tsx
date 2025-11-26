import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, MessageSquare, Eye } from 'lucide-react';

const collaborations = [
    { icon: <Rocket />, text: "Launch products into the right hands early" },
    { icon: <Target />, text: "Build trust through community affiliation" },
    { icon: <MessageSquare />, text: "Collect authentic feedback" },
    { icon: <Eye />, text: "Generate organic social content" },
];

const Collaboration: React.FC = () => {
  return (
    <section className="py-24 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-7xl font-syne font-semibold mb-4">Collaboration</h2>
                <h3 className="text-3xl font-light text-zinc-300 mb-12">Why brands partner with CTRL + SHIFT</h3>
                
                <div className="space-y-10">
                    {collaborations.map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            whileHover={{ x: 10 }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            className="flex items-center gap-6 cursor-default"
                        >
                            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                                {item.icon}
                            </div>
                            <span className="text-xl font-medium">{item.text}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative h-[600px] rounded-2xl overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent mix-blend-overlay z-10"></div>
                <picture>
                  <source srcSet="/assets/images/collaboration.webp" type="image/webp" />
                  <img 
                      src="/assets/images/collaboration.jpg" 
                      alt="CTRL+SHIFT event presentation"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                  />
                </picture>
            </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Collaboration;