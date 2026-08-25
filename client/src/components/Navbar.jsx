import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
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
              {user.accountType === "seller" && (
                <Link to="/create" className="hover:text-campus-gold transition-colors">
                  Sell an item
                </Link>
              )}
              <Link to="/dashboard" className="hover:text-campus-gold transition-colors">
                Dashboard
              </Link>
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
