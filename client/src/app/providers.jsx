"use client";

import { AuthProvider } from "../context/AuthContext.jsx";
import { WishlistProvider } from "../context/WishlistContext.jsx";

export default function Providers({ children }) {
  return <AuthProvider><WishlistProvider>{children}</WishlistProvider></AuthProvider>;
}
