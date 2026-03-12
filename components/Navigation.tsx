
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpRight, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'who-we-are', label: 'About' },
    { id: 'audience', label: 'Audience' },
    { id: 'events', label: 'Events' },
    { id: 'expansion', label: 'Expansion' },
    { id: 'contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
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

        <button
          onClick={() => setIsMenuOpen(prev => !prev)}
          className="md:hidden w-11 h-11 flex items-center justify-center text-white border border-white/20 rounded-lg bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={(e) => scrollToSection(e, item.id)} className="hover:text-white transition-colors">
              {item.label}
            </a>
          ))}
          
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

      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl px-6 pb-6 pt-4">
          <div className="flex flex-col gap-2 text-zinc-100">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className="w-full rounded-lg border border-white/10 px-4 py-3 text-base hover:bg-white/10 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://luma.com/ctrlshift?k=c"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full rounded-lg bg-purple-600 px-4 py-3 text-base font-semibold text-white flex items-center justify-center gap-2"
            >
              Upcoming Events <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navigation;
