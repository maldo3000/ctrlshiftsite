import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './src/pages/HomePage';
import { RedirectIfSponsorAuthed, RequireSponsorAuth, SponsorAuthProvider } from './src/sponsors/auth';

// Sponsor pages pull in recharts, xlsx and react-table — keep them out of the
// main bundle so the public homepage doesn't pay for them.
const SponsorLayout = lazy(() => import('./src/sponsors/components/SponsorLayout'));
const SponsorLoginPage = lazy(() => import('./src/sponsors/pages/SponsorLoginPage'));
const SponsorsLandingPage = lazy(() => import('./src/sponsors/pages/SponsorsLandingPage'));
const SponsorVol9ReportPage = lazy(() => import('./src/sponsors/pages/SponsorVol9ReportPage'));

function App() {
  return (
    <BrowserRouter>
      <SponsorAuthProvider>
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/sponsors/login"
            element={
              <RedirectIfSponsorAuthed>
                <SponsorLoginPage />
              </RedirectIfSponsorAuthed>
            }
          />

          <Route
            element={
              <RequireSponsorAuth>
                <SponsorLayout />
              </RequireSponsorAuth>
            }
          >
            <Route path="/sponsors" element={<SponsorsLandingPage />} />
            <Route path="/sponsors/vol-9" element={<SponsorVol9ReportPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </SponsorAuthProvider>
    </BrowserRouter>
  );
}

export default App;
