
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 text-white cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Sparkles className="w-5 h-5 text-white" />
          <span className="font-syne font-semibold text-xl tracking-[-0.05em]">CTRL + SHIFT</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <a href="#who-we-are" onClick={(e) => scrollToSection(e, 'who-we-are')} className="hover:text-white transition-colors">About</a>
          <a href="#audience" onClick={(e) => scrollToSection(e, 'audience')} className="hover:text-white transition-colors">Audience</a>
          <a href="#events" onClick={(e) => scrollToSection(e, 'events')} className="hover:text-white transition-colors">Events</a>
          <a href="#expansion" onClick={(e) => scrollToSection(e, 'expansion')} className="hover:text-white transition-colors">Expansion</a>
          
          <a 
            href="https://luma.com/ctrlshift?k=c" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 text-purple-400 hover:text-white transition-colors"
          >
            Upcoming Events <ArrowUpRight size={14} />
          </a>

          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
            Get in Touch
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
