import { useEffect, useState } from 'react';
import { supabase } from "./supabaseClient";
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './cartContext';
import NavBar from './NavBar.jsx'
import Products from './products.jsx';
import HeroSection from './HeroSection.jsx';
import Cart from './Cart.jsx';
import Orders from './Orders.jsx';
import Login from './loginPage.jsx';
import SignUp from './signupPage.jsx';
import ProductDetail from './ProductDetail.jsx';
import Profile from './Profile.jsx';
import WishList from './WishList.jsx'
import ForgotPassword from './ForgotPassword.jsx'
import ResetPassword from './ResetPassword.jsx'

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
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recoverySession, setRecoverySession] = useState(null); // ✅ store recovery session

  useEffect(() => {
    // Check URL hash on first load
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      navigate("/reset-password");
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);

        if (_event === "PASSWORD_RECOVERY") {
          setRecoverySession(session); // ✅ save the session
          navigate("/reset-password");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  return (
    <CartProvider user={user}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index element={<PageWrapper><HeroSection /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><SignUp /></PageWrapper>} />
          <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
          {/* ✅ Pass recoverySession to ResetPassword */}
          <Route path="/reset-password" element={
            <PageWrapper><ResetPassword recoverySession={recoverySession} /></PageWrapper>
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
          <Route path="/product/:id" element={
            <PageWrapper><NavBar user={user} /><ProductDetail /></PageWrapper>
          } />
          <Route path="/profile" element={
            <PageWrapper><NavBar user={user} /><Profile user={user} /></PageWrapper>
          } />
          <Route path="/wishlist" element={
            <PageWrapper><NavBar user={user} /><WishList /></PageWrapper>
          } />
        </Routes>
      </AnimatePresence>
    </CartProvider>
  )
}