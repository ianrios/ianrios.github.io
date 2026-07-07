import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Main } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { DesignVarsProvider } from './hooks/DesignVarsProvider';
import { AppErrorBoundary } from './AppErrorBoundary';

const Admin = lazy(() => import('./pages/Admin'));
const ThreeScene = lazy(() => import('./three/ThreeScene'));

const loadingFallback = <div className="skeu-admin-section-desc">Loading</div>;

function App() {
  return (
    <AppErrorBoundary>
      <DesignVarsProvider>
        <Suspense fallback={loadingFallback}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/design-system" element={<Admin />} />
            {/* Permanent alias - resume/GitHub links point at the old route */}
            <Route
              path="/admin"
              element={<Navigate to="/design-system" replace />}
            />
            <Route path="/three" element={<ThreeScene />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </DesignVarsProvider>
    </AppErrorBoundary>
  );
}

export default App;
