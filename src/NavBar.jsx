import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./cartContext";
import { supabase } from "./supabaseClient";

import logoImage from "./assets/logo.jpg";
import cartImage from "./assets/shopping-cart.png";
import homeicon from "./assets/homeIcon.jpg";
import ordersIcon from "./assets/orders.jpg";

function NavBar({ user }) {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) { setProfile(null); return; }
      const { data, error } = await supabase
        .from("profiles").select("name, email").eq("id", user.id).single();
      if (!error && data) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    navigate("/homepage");
  };

  const menuItems = [
    {
      label: "My Profile",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      ),
      onClick: () => { setDropdownOpen(false); navigate("/profile"); },
    },
    {
      label: "My Orders",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      ),
      onClick: () => { setDropdownOpen(false); navigate("/orders"); },
    },
    {
      label: "Wishlist",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      ),
      onClick: () => { setDropdownOpen(false); navigate("/wishlist"); },
    },
  ];

  return (
    <>
      <style>{`
        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 1px 32px rgba(0,0,0,0.05);
          font-family: 'DM Sans', sans-serif;
        }
        .navbar-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 2rem; height: 68px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .navbar-brand {
          display: flex; align-items: center; gap: 0.75rem;
          cursor: pointer; padding: 0.4rem 0.6rem;
          border-radius: 12px; transition: background 0.2s ease;
        }
        .navbar-brand:hover { background: rgba(0,0,0,0.04); }
        .navbar-logo {
          width: 40px; height: 40px; border-radius: 10px; object-fit: cover;
          border: 1.5px solid rgba(0,0,0,0.08);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .navbar-brand-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 700; color: #0a0a0a;
          letter-spacing: -0.01em; white-space: nowrap;
        }
        .navbar-brand-text span { color: #9ca3af; font-weight: 400; }
        .navbar-actions { display: flex; align-items: center; gap: 0.25rem; }

        /* Nav pills */
        .nav-pill {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.45rem 0.9rem; border-radius: 100px;
          font-size: 0.85rem; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; border: none; background: transparent;
          color: #4b5563; transition: all 0.15s ease;
        }
        .nav-pill:hover { background: #f3f4f6; color: #111827; }
        .nav-pill:active { transform: scale(0.96); }
        .nav-pill-icon { width: 15px; height: 15px; object-fit: contain; opacity: 0.65; }

        /* Cart badge */
        .cart-badge {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 17px; height: 17px; padding: 0 4px; border-radius: 100px;
          background: #111827; color: white; font-size: 0.65rem; font-weight: 700;
          animation: badgePop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes badgePop { from { transform: scale(0); } to { transform: scale(1); } }

        /* Divider */
        .nav-divider { width: 1px; height: 22px; background: #e5e7eb; margin: 0 0.25rem; }

        /* Auth buttons */
        .btn-outline {
          padding: 0.44rem 1rem; border-radius: 100px;
          font-size: 0.85rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          background: white; color: #111827; border: 1.5px solid #d1d5db;
          transition: all 0.15s ease;
        }
        .btn-outline:hover { border-color: #9ca3af; background: #f9fafb; }
        .btn-primary {
          padding: 0.44rem 1.1rem; border-radius: 100px;
          font-size: 0.85rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          background: #111827; color: white; border: none;
          transition: all 0.15s ease;
          box-shadow: 0 3px 12px rgba(17,24,39,0.2);
        }
        .btn-primary:hover { background: #1f2937; transform: translateY(-1px); box-shadow: 0 5px 16px rgba(17,24,39,0.25); }

        /* Profile trigger button */
        .profile-trigger {
          display: inline-flex; align-items: center; gap: 0.55rem;
          padding: 0.3rem 0.75rem 0.3rem 0.3rem;
          border-radius: 100px; border: 1.5px solid #e5e7eb;
          background: white; cursor: pointer;
          transition: all 0.15s ease; font-family: 'DM Sans', sans-serif;
          position: relative;
        }
        .profile-trigger:hover { border-color: #9ca3af; background: #fafafa; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .profile-trigger.open { border-color: #111827; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

        .profile-avatar {
          width: 30px; height: 30px; border-radius: 100px;
          background: linear-gradient(135deg, #1f2937, #374151);
          color: white; display: flex; align-items: center; justify-content: center;
          font-size: 0.78rem; font-weight: 700; flex-shrink: 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .profile-name { font-size: 0.82rem; font-weight: 600; color: #111827; }
        .profile-chevron {
          width: 14px; height: 14px; color: #9ca3af;
          transition: transform 0.2s ease;
        }
        .profile-chevron.rotated { transform: rotate(180deg); }

        /* Dropdown */
        .profile-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 220px;
          background: white; border: 1px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
          transform-origin: top right;
          animation: dropdownIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 200;
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: scale(0.92) translateY(-6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Dropdown header */
        .dropdown-header {
          padding: 14px 16px 12px;
          border-bottom: 1px solid #f3f4f6;
        }
        .dropdown-user-name { font-size: 0.875rem; font-weight: 700; color: #111827; }
        .dropdown-user-email { font-size: 0.75rem; color: #9ca3af; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* Dropdown items */
        .dropdown-items { padding: 6px; }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 10px;
          font-size: 0.85rem; font-weight: 500; color: #374151;
          cursor: pointer; transition: all 0.12s ease;
          border: none; background: transparent; width: 100%; text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        .dropdown-item:hover { background: #f3f4f6; color: #111827; }
        .dropdown-item:active { background: #e5e7eb; }
        .dropdown-item-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: #f9fafb; border: 1px solid #f3f4f6;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: background 0.12s ease;
        }
        .dropdown-item:hover .dropdown-item-icon { background: #f3f4f6; }
        .dropdown-item-icon svg { width: 15px; height: 15px; color: #6b7280; }

        /* Sign out */
        .dropdown-divider { height: 1px; background: #f3f4f6; margin: 4px 6px; }
        .dropdown-signout {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 10px;
          font-size: 0.85rem; font-weight: 500; color: #ef4444;
          cursor: pointer; transition: all 0.12s ease;
          border: none; background: transparent; width: 100%; text-align: left;
          font-family: 'DM Sans', sans-serif; margin: 0 0 4px;
        }
        .dropdown-signout:hover { background: #fef2f2; }
        .dropdown-signout-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: #fef2f2; border: 1px solid #fee2e2;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dropdown-signout-icon svg { width: 15px; height: 15px; color: #ef4444; }

        @media (max-width: 640px) {
          .navbar-inner { padding: 0 1rem; height: 60px; }
          .navbar-brand-text { display: none; }
          .nav-pill-label { display: none; }
          .nav-divider { display: none; }
          .profile-name { display: none; }
          .profile-chevron { display: none; }
          .profile-trigger { padding: 0.3rem; }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-inner">

          {/* Brand */}
          <div className="navbar-brand" onClick={() => navigate("/homepage")}>
            <img src={logoImage} alt="Logo" className="navbar-logo" />
            <span className="navbar-brand-text">E-commerce <span>Store</span></span>
          </div>

          {/* Actions */}
          <div className="navbar-actions">

            <button className="nav-pill" onClick={() => navigate("/homepage")}>
              <img src={homeicon} alt="Home" className="nav-pill-icon" />
              <span className="nav-pill-label">Home</span>
            </button>

            <button className="nav-pill" onClick={() => navigate("/orders")}>
              <img src={ordersIcon} alt="Orders" className="nav-pill-icon" />
              <span className="nav-pill-label">Orders</span>
            </button>

            <button className="nav-pill" onClick={() => navigate("/cart")}>
              <img src={cartImage} alt="Cart" className="nav-pill-icon" />
              <span className="nav-pill-label">Cart</span>
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </button>

            <div className="nav-divider" />

            {user ? (
              // ── Profile dropdown ──
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                  className={`profile-trigger ${dropdownOpen ? "open" : ""}`}
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <div className="profile-avatar">
                    {profile?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <span className="profile-name">
                    {profile?.name?.split(" ")[0] ?? "..."}
                  </span>
                  <svg className={`profile-chevron ${dropdownOpen ? "rotated" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="profile-dropdown">

                    {/* User info header */}
                    <div className="dropdown-header">
                      <p className="dropdown-user-name">{profile?.name || "User"}</p>
                      <p className="dropdown-user-email">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="dropdown-items">
                      {menuItems.map((item) => (
                        <button key={item.label} className="dropdown-item" onClick={item.onClick}>
                          <div className="dropdown-item-icon">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {item.icon}
                            </svg>
                          </div>
                          {item.label}
                        </button>
                      ))}

                      <div className="dropdown-divider" />

                      {/* Sign out */}
                      <button className="dropdown-signout" onClick={handleSignOut}>
                        <div className="dropdown-signout-icon">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
                <button className="btn-primary" onClick={() => navigate("/signup")}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;