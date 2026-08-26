import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout, switchAccountType } = useAuth();
  const navigate = useNavigate();
  const [switching, setSwitching] = useState(false);

  const isSeller = user?.accountType === "seller";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBecomeSeller = async () => {
    setSwitching(true);
    try {
      await switchAccountType("seller");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <header className="border-b border-campus-navy/10 bg-campus-cream/95 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-700 tracking-tight text-campus-navy">
          Uni<span className="text-campus-gold">Shop</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-campus-gold transition-colors">
            Marketplace
          </Link>
          {user ? (
            <>
              {isSeller && (
                <Link to="/create" className="hover:text-campus-gold transition-colors">
                  Sell an item
                </Link>
              )}
              <Link to="/wishlist" className="hover:text-campus-gold transition-colors">
                Wishlist
              </Link>
              {isSeller ? (
                <Link to="/dashboard" className="hover:text-campus-gold transition-colors">
                  Dashboard
                </Link>
              ) : (
                <button
                  onClick={handleBecomeSeller}
                  disabled={switching}
                  className="hover:text-campus-gold transition-colors disabled:opacity-50"
                >
                  {switching ? "Switching..." : "Become a seller"}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="rounded-full bg-campus-navy text-campus-cream px-4 py-1.5 hover:bg-campus-navy/90 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-campus-gold transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-campus-navy text-campus-cream px-4 py-1.5 hover:bg-campus-navy/90 transition-colors"
              >
                Join UniShop
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;