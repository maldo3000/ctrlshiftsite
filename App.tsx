import React, { useState, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import FluidBackground from './components/FluidBackground';

// Lazy load below-the-fold components for code splitting
const RetroDesktop = lazy(() => import('./components/RetroDesktop'));
const WhoWeAre = lazy(() => import('./components/WhoWeAre'));
const Audience = lazy(() => import('./components/Audience'));
const EventFormat = lazy(() => import('./components/EventFormat'));
const ContentPillars = lazy(() => import('./components/ContentPillars'));
const PreviousTalks = lazy(() => import('./components/PreviousTalks'));
const Growth = lazy(() => import('./components/Growth'));
const Collaboration = lazy(() => import('./components/Collaboration'));
const ExpansionPlan = lazy(() => import('./components/ExpansionPlan'));
const CtrlshiftCon = lazy(() => import('./components/CtrlshiftCon'));
const Footer = lazy(() => import('./components/Footer'));

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
            <Suspense fallback={<div className="w-full h-full bg-[#008080]" />}>
              <RetroDesktop onLaunch={() => setIsLaunched(true)} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <FluidBackground />
      
      <Navigation />
      
      <main className="relative z-10">
        <Hero />
        <Suspense fallback={null}>
          <WhoWeAre />
          <Audience />
          <EventFormat />
          <ContentPillars />
          <PreviousTalks />
          <Growth />
          <Collaboration />
          <ExpansionPlan />
          <CtrlshiftCon />
        </Suspense>
      </main>
      
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;