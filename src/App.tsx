import { Routes, Route } from 'react-router-dom';
import { Main } from './pages/Home';
import Admin from './pages/Admin';
import { DesignSystemDrawer } from './components/organisms/DesignSystemDrawer';

// Flex container: drawer occupies left-edge space and pushes Main to the right.
// overflow: hidden on the outer div + overflowY: auto on each column means both
// the panel and the page content scroll independently.
function HomeWithDrawer() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <DesignSystemDrawer />
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <Main />
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeWithDrawer />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
