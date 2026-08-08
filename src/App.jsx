import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Redirect any old /apply links back to home#apply */}
      <Route path="/apply" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
