import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./cartContext";
import { supabase } from "./supabaseClient";

import logoImage from "./assets/logo.jpg";
import cartImage from "./assets/shopping-cart.png";
import homeicon from "./assets/homeIcon.jpg";
import ordersIcon from "./assets/orders.jpg"

function NavBar({ user }) {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Inject Google Fonts
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) { setProfile(null); return; }
      const { data, error } = await supabase
        .from("profiles").select("name").eq("id", user.id).single();
      if (!error && data) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  return (
    <>
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 1px 40px rgba(0,0,0,0.05);
          font-family: 'DM Sans', sans-serif;
        }

        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* BRAND */
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.4rem 0.6rem;
          border-radius: 12px;
          transition: background 0.2s ease;
          text-decoration: none;
        }
        .navbar-brand:hover { background: rgba(0,0,0,0.04); }

        .navbar-logo {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          object-fit: cover;
          border: 1.5px solid rgba(0,0,0,0.08);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .navbar-brand-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .navbar-brand-text span {
          color: #6b7280;
          font-weight: 400;
        }

        /* ACTIONS */
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        /* NAV PILLS */
        .nav-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          border: none;
          background: transparent;
          color: #374151;
          transition: all 0.18s ease;
          letter-spacing: 0.01em;
          position: relative;
        }
        .nav-pill:hover {
          background: #f3f4f6;
          color: #111827;
        }
        .nav-pill:active { transform: scale(0.97); }

        .nav-pill-icon {
          width: 16px;
          height: 16px;
          object-fit: contain;
          opacity: 0.75;
        }

        /* CART BADGE */
        .cart-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 100px;
          background: #111827;
          color: white;
          font-size: 0.68rem;
          font-weight: 700;
          line-height: 1;
          animation: badgePop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes badgePop {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        /* DIVIDER */
        .nav-divider {
          width: 1px;
          height: 24px;
          background: #e5e7eb;
          margin: 0 0.3rem;
        }

        /* GREETING */
        .nav-greeting {
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
          font-family: 'DM Sans', sans-serif;
          padding: 0 0.5rem;
          white-space: nowrap;
        }

        .nav-greeting em {
          font-style: normal;
          color: #111827;
        }

        /* OUTLINE BUTTON */
        .btn-outline {
          padding: 0.48rem 1.1rem;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          background: white;
          color: #111827;
          border: 1.5px solid #d1d5db;
          transition: all 0.18s ease;
          letter-spacing: 0.01em;
        }
        .btn-outline:hover {
          border-color: #9ca3af;
          background: #f9fafb;
        }
        .btn-outline:active { transform: scale(0.97); }

        /* PRIMARY BUTTON */
        .btn-primary {
          padding: 0.48rem 1.2rem;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          background: #111827;
          color: white;
          border: none;
          transition: all 0.18s ease;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 14px rgba(17,24,39,0.25);
        }
        .btn-primary:hover {
          background: #1f2937;
          box-shadow: 0 6px 18px rgba(17,24,39,0.3);
          transform: translateY(-1px);
        }
        .btn-primary:active { transform: scale(0.97); }

        /* MOBILE */
        @media (max-width: 640px) {
          .navbar-inner { padding: 0 1rem; height: 60px; }
          .navbar-brand-text { display: none; }
          .nav-pill-label { display: none; }
          .nav-greeting { display: none; }
          .nav-divider { display: none; }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-inner">

          {/* Brand */}
          <div className="navbar-brand" onClick={() => navigate("/homepage")}>
            <img src={logoImage} alt="Logo" className="navbar-logo" />
            <span className="navbar-brand-text">
              E-commerce <span>Store</span>
            </span>
          </div>

          {/* Actions */}
          <div className="navbar-actions">

            {/* Home */}
            <button className="nav-pill" onClick={() => navigate("/homepage")}>
              <img src={homeicon} alt="Home" className="nav-pill-icon" />
              <span className="nav-pill-label">Home</span>
            </button>
                        <button className="nav-pill" onClick={() => navigate("/orders")}>
              <img src={ordersIcon} alt="Home" className="nav-pill-icon" />
              <span className="nav-pill-label">Orders</span>
            </button>

            {/* Cart */}
            <button className="nav-pill" onClick={() => navigate("/cart")}>
              <img src={cartImage} alt="Cart" className="nav-pill-icon" />
              <span className="nav-pill-label">Cart</span>
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </button>

            <div className="nav-divider" />

            {/* Auth */}
            {user ? (
              <>
                <span className="nav-greeting">
                  Hey, <em>{profile?.name ?? "..."}</em>
                </span>
                <button
                  className="btn-outline"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/homepage");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="btn-outline" onClick={() => navigate("/login")}>
                  Login
                </button>
                <button className="btn-primary" onClick={() => navigate("/signup")}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;