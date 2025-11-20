
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Youtube, Instagram, Twitter } from 'lucide-react';
import KeyboardInteraction from './KeyboardInteraction';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-32 border-t border-white/10 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="flex flex-col">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-7xl md:text-9xl font-syne font-semibold tracking-tighter leading-none mb-12"
                >
                    Let's Build<br/>
                    the Ecosystem<br/>
                    of New Creatives
                </motion.h2>
                
            </div>

            <div className="flex flex-col justify-between space-y-12">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full flex justify-center lg:justify-end mb-8"
                >
                    <div className="w-full max-w-md transform scale-90 lg:scale-100 origin-center lg:origin-top-right">
                        <KeyboardInteraction />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-zinc-300 space-y-6"
                >
                    <p>If you’re interested in collaborating, supporting or attending CTRL+SHIFT we’d love to stay in touch.</p>
                    <p>We’re committed to growing the brand and community and connecting with the right people along the way.</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 gap-8"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/20 pb-2">
                            <span className="text-zinc-400">Website</span>
                            <a href="#" className="font-bold hover:text-purple-400 transition-colors">ctrlshift.community</a>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/20 pb-2">
                            <span className="text-zinc-400">Youtube</span>
                            <a href="#" className="font-bold hover:text-red-500 transition-colors flex items-center gap-2"><Youtube size={16}/> @CTRLSHIFT-AI</a>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/20 pb-2">
                            <span className="text-zinc-400">Instagram</span>
                            <a href="#" className="font-bold hover:text-pink-500 transition-colors flex items-center gap-2"><Instagram size={16}/> @ctrlshift_ai</a>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/20 pb-2">
                            <span className="text-zinc-400">X</span>
                            <a href="#" className="font-bold hover:text-blue-400 transition-colors flex items-center gap-2"><Twitter size={16}/> @ctrlshift_ai</a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>

        <div className="mt-24 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-600">
            <span>www.ctrlshift.community</span>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
                <span>@ctrlshift_ai</span>
                <ArrowRight size={14} />
            </div>
        </div>
      </div>
      
      {/* Decorative blur */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
