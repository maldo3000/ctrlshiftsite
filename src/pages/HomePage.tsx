import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from '../../components/Navigation';
import Hero from '../../components/Hero';
import FluidBackground from '../../components/FluidBackground';

const RetroDesktop = lazy(() => import('../../components/RetroDesktop'));
const WhoWeAre = lazy(() => import('../../components/WhoWeAre'));
const Audience = lazy(() => import('../../components/Audience'));
const EventFormat = lazy(() => import('../../components/EventFormat'));
const ContentPillars = lazy(() => import('../../components/ContentPillars'));
const PreviousTalks = lazy(() => import('../../components/PreviousTalks'));
const Growth = lazy(() => import('../../components/Growth'));
const Collaboration = lazy(() => import('../../components/Collaboration'));
const ExpansionPlan = lazy(() => import('../../components/ExpansionPlan'));
const CtrlshiftCon = lazy(() => import('../../components/CtrlshiftCon'));
const Footer = lazy(() => import('../../components/Footer'));

// The retro desktop is a fun intro, not a gate: "/" goes straight to the
// site, and "/launch" starts at the emulator (which lands back on "/").
function HomePage({ startAtDesktop = false }: { startAtDesktop?: boolean }) {
  const [isLaunched, setIsLaunched] = useState(!startAtDesktop);
  const navigate = useNavigate();
  const location = useLocation();

  // "/" and "/launch" render this same component, so React keeps the instance
  // (and its state) across in-app navigation between them — sync with the URL.
  // Launching sets isLaunched *before* navigating to "/", so this effect is a
  // no-op then and the zoom-out exit still plays.
  useEffect(() => {
    setIsLaunched(location.pathname !== '/launch');
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen text-white selection:bg-white selection:text-black">
      <AnimatePresence mode="wait">
        {!isLaunched && (
          <motion.div
            key="retro-desktop"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 15,
              transition: { duration: 1.2, ease: 'easeInOut' }
            }}
            // Scale/opacity animate on this outer layer and the blur on the inner
            // one: filter-before-transform composes identically (CSS order), but
            // split this way the blur runs over a viewport-sized texture instead
            // of re-rasterizing a 15x-scaled fullscreen layer every frame.
            // pointer-events off during the exit so the overlay never blocks the
            // page underneath while it zooms away.
            style={{ pointerEvents: isLaunched ? 'none' : undefined, willChange: 'transform, opacity' }}
            className="fixed inset-0 z-[100] origin-center"
          >
            <motion.div
              exit={{
                filter: 'blur(20px) brightness(1.5)',
                transition: { duration: 1.2, ease: 'easeInOut' }
              }}
              className="h-full w-full"
            >
              <Suspense fallback={<div className="h-full w-full bg-[#008080]" />}>
                <RetroDesktop
                  onLaunch={() => {
                    setIsLaunched(true);
                    navigate('/', { replace: true });
                  }}
                />
              </Suspense>
            </motion.div>
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

export default HomePage;
