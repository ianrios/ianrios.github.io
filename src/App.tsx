import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Main } from './pages/Home';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';
import { DesignVarsProvider } from './hooks/DesignVarsProvider';
import { NavChromeProvider } from './hooks/NavChromeProvider';
import { AppErrorBoundary } from './AppErrorBoundary';
import { CookieConsent } from './components/organisms/CookieConsent';
import { useCookieConsent } from './hooks/cookieConsent';
import { initAnalytics } from './analytics';

const Admin = lazy(() => import('./pages/Admin'));
const ThreeScene = lazy(() => import('./three/ThreeScene'));

const loadingFallback = <div className="skeu-admin-section-desc">Loading</div>;

function App() {
  const { consent, accept, decline } = useCookieConsent();

  return (
    <AppErrorBoundary>
      <DesignVarsProvider>
        <NavChromeProvider>
          <Suspense fallback={loadingFallback}>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/about" element={<About />} />
              <Route path="/design-system" element={<Admin />} />
              <Route path="/metaballs" element={<ThreeScene />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </NavChromeProvider>
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
