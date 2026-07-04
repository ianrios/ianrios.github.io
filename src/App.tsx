import { Routes, Route, Navigate } from 'react-router-dom';
import { Main } from './pages/Home';
import Admin from './pages/Admin';
import ThreeScene from './three/ThreeScene';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/design-system" element={<Admin />} />
      {/* Permanent alias - resume/GitHub links may point at the old route */}
      <Route path="/admin" element={<Navigate to="/design-system" replace />} />
      <Route path="/three" element={<ThreeScene />} />
    </Routes>
  );
}

export default App;
