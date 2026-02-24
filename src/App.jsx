import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence,motion } from 'framer-motion';
import NavBar from './NavBar.jsx'
import Products from './products.jsx';
import Example from './HeroSection.jsx';
import Cart from './Cart.jsx';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={
          <PageWrapper><Example /></PageWrapper>
        } />
        <Route path="/homepage" element={
          <PageWrapper><NavBar /><Products /></PageWrapper>
        } />
        <Route path="/cart" element={
          <PageWrapper><NavBar /><Cart /></PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  )
}