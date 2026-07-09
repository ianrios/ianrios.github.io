import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Main } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { DesignVarsProvider } from './hooks/DesignVarsProvider';
import { DesignPanelProvider } from './hooks/DesignPanelProvider';
import { NavChromeProvider } from './hooks/NavChromeProvider';
import { SiteNav } from './pages/SiteNav';
import { RouteTransitions } from './pages/RouteTransitions';
import { CursorFX } from './components/organisms/CursorFX';
import { TextureOverlay } from './components/organisms/TextureOverlay';
import { AppErrorBoundary } from './AppErrorBoundary';
import { CookieConsent } from './components/organisms/CookieConsent';
import { useCookieConsent } from './hooks/cookieConsent';
import { initAnalytics } from './analytics';

const Admin = lazy(() => import('./pages/Admin'));
const ThreeScene = lazy(() => import('./three/ThreeScene'));

const loadingFallback = <div className="skeu-admin-section-desc">Loading</div>;

function App() {
  const { consent, accept, decline } = useCookieConsent();
  // Remount Home on each navigation to `/` so it re-reads the view from
  // router state (portfolio -> main, title -> welcome splash). In-page tab
  // clicks do not navigate, so they never trigger this.
  const location = useLocation();

  return (
    <AppErrorBoundary>
      <DesignVarsProvider>
        <DesignPanelProvider>
          <NavChromeProvider>
            <Suspense fallback={loadingFallback}>
              <Routes>
                <Route path="/" element={<Main key={location.key} />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/design-system" element={<Admin />} />
                <Route path="/metaballs" element={<ThreeScene />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <SiteNav />
            <RouteTransitions />
            <CursorFX />
            <TextureOverlay />
          </NavChromeProvider>
        </DesignPanelProvider>
        <CookieConsent
          visible={consent === null}
          onAccept={() => {
            accept();
            initAnalytics();
          }}
          onDecline={decline}
        />
      </DesignVarsProvider>
    </AppErrorBoundary>
  );
}

export default App;
