import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";
import * as wishlistService from "../services/wishlistService.js";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setWishlistIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const items = await wishlistService.getWishlist();
      setWishlistIds(new Set(items.map((p) => p._id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isWishlisted = (productId) => wishlistIds.has(productId);

  const toggleWishlist = async (productId) => {
    const next = new Set(wishlistIds);
    if (next.has(productId)) {
      next.delete(productId);
      setWishlistIds(next);
      try {
        await wishlistService.removeFromWishlist(productId);
      } catch (err) {
        console.error(err);
        refresh();
      }
    } else {
      next.add(productId);
      setWishlistIds(next);
      try {
        await wishlistService.addToWishlist(productId);
      } catch (err) {
        console.error(err);
        refresh();
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, loading, isWishlisted, toggleWishlist, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);