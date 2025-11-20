import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import WhoWeAre from './components/WhoWeAre';
import Audience from './components/Audience';
import EventFormat from './components/EventFormat';
import ContentPillars from './components/ContentPillars';
import PreviousTalks from './components/PreviousTalks';
import Growth from './components/Growth';
import Offering from './components/Offering';
import ExpansionPlan from './components/ExpansionPlan';
import CtrlshiftCon from './components/CtrlshiftCon';
import Footer from './components/Footer';
import FluidBackground from './components/FluidBackground';
import RetroDesktop from './components/RetroDesktop';

function App() {
  const [isLaunched, setIsLaunched] = useState(false);

  return (
    <div className="relative min-h-screen text-white selection:bg-white selection:text-black">
      <AnimatePresence mode="wait">
        {!isLaunched && (
          <motion.div
            key="retro-desktop"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 15, // Zoom in effect
              filter: "blur(20px) brightness(1.5)", // Blur + brightness for "portal" feel
              transition: { duration: 1.2, ease: "easeInOut" } 
            }}
            className="fixed inset-0 z-[100] origin-center"
          >
            <RetroDesktop onLaunch={() => setIsLaunched(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <FluidBackground />
      
      <Navigation />
      
      <main className="relative z-10">
        <Hero />
        <WhoWeAre />
        <Audience />
        <EventFormat />
        <ContentPillars />
        <PreviousTalks />
        <Growth />
        <Offering />
        <ExpansionPlan />
        <CtrlshiftCon />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;