import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './src/pages/HomePage';
import { RedirectIfSponsorAuthed, RequireSponsorAuth, SponsorAuthProvider } from './src/sponsors/auth';
import SponsorLayout from './src/sponsors/components/SponsorLayout';
import SponsorLoginPage from './src/sponsors/pages/SponsorLoginPage';
import SponsorsLandingPage from './src/sponsors/pages/SponsorsLandingPage';
import SponsorVol9ReportPage from './src/sponsors/pages/SponsorVol9ReportPage';

function App() {
  return (
    <BrowserRouter>
      <SponsorAuthProvider>
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
      </SponsorAuthProvider>
    </BrowserRouter>
  );
}

export default App;
