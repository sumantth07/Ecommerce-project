import { useEffect, useState } from 'react';
import { supabase } from "./supabaseClient";
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence,motion } from 'framer-motion';
import { CartProvider } from './cartContext';
import NavBar from './NavBar.jsx'
import Products from './products.jsx';
import HeroSection from './HeroSection.jsx';
import Cart from './Cart.jsx';
import Orders from './Orders.jsx';
import Login from './loginPage.jsx';
import SignUp from './signupPage.jsx';

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <CartProvider user={user}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index element={
            <PageWrapper><HeroSection /></PageWrapper>
          } />
          <Route path="/login" element={
            <PageWrapper><Login /></PageWrapper>
          } />
          <Route path="/signup" element={
            <PageWrapper><SignUp /></PageWrapper>
          } />
          <Route path="/homepage" element={
            <PageWrapper><NavBar user={user} /><Products /></PageWrapper>
          } />
          <Route path="/cart" element={
            <PageWrapper><NavBar user={user} /><Cart /></PageWrapper>
          } />
          
          <Route path="/orders" element={
            <PageWrapper><NavBar user={user} /><Orders user={user} /></PageWrapper>
          } />
        </Routes>
      </AnimatePresence>
    </CartProvider>
  )
}