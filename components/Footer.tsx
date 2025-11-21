
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Youtube, Instagram, Twitter } from 'lucide-react';
import KeyboardInteraction from './KeyboardInteraction';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-20 md:py-32 border-t border-white/10 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-start">
            <div className="flex flex-col lg:pt-8">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-7xl md:text-9xl font-syne font-semibold tracking-tighter leading-[0.95] mb-8 lg:mb-0"
                >
                    Let's Build<br/>
                    the Ecosystem<br/>
                    of New Creatives
                </motion.h2>
            </div>

            <div className="flex flex-col space-y-8 lg:space-y-10">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="w-full flex justify-center lg:justify-end"
                >
                    <div className="w-full max-w-sm lg:max-w-md transform scale-90 lg:scale-100 origin-center lg:origin-top-right">
                        <KeyboardInteraction />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-zinc-300 space-y-4 lg:space-y-6 max-w-lg lg:ml-auto"
                >
                    <p>If you're interested in collaborating, supporting or attending CTRL+SHIFT we'd love to stay in touch.</p>
                    <p>We're committed to growing the brand and community and connecting with the right people along the way.</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 lg:gap-x-12 lg:gap-y-8 max-w-lg lg:ml-auto"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/20 pb-2 gap-4">
                            <span className="text-zinc-400 text-sm md:text-base whitespace-nowrap">Website</span>
                            <a href="https://www.ctrlshift.community" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-purple-400 transition-colors text-sm md:text-base whitespace-nowrap text-right">ctrlshift.community</a>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/20 pb-2 gap-4">
                            <span className="text-zinc-400 text-sm md:text-base whitespace-nowrap">Youtube</span>
                            <a href="https://www.youtube.com/@CTRLSHIFT-AI" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-red-500 transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap"><Youtube size={16}/> @CTRLSHIFT-AI</a>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/20 pb-2 gap-4">
                            <span className="text-zinc-400 text-sm md:text-base whitespace-nowrap">Instagram</span>
                            <a href="https://www.instagram.com/ctrlshift_ai/" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-pink-500 transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap"><Instagram size={16}/> @ctrlshift_ai</a>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/20 pb-2 gap-4">
                            <span className="text-zinc-400 text-sm md:text-base whitespace-nowrap">X</span>
                            <a href="https://x.com/ctrlshift_ai" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-blue-400 transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap"><Twitter size={16}/> @ctrlshift_ai</a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>

        <div className="mt-16 lg:mt-24 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-600 pt-8 border-t border-white/10">
            <a href="https://www.ctrlshift.community" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">www.ctrlshift.community</a>
            <a href="https://www.instagram.com/ctrlshift_ai/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-4 md:mt-0 hover:text-zinc-400 transition-colors">
                <span>@ctrlshift_ai</span>
                <ArrowRight size={14} />
            </a>
        </div>
      </div>
      
      {/* Decorative blur */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
