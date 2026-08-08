import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Preloader from './components/Preloader.jsx';
import CustomCursor from './components/CustomCursor.jsx';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
