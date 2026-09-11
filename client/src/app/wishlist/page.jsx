"use client";
import Wishlist from "../../views/Wishlist.jsx";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
export default function Page() { return <ProtectedRoute><Wishlist /></ProtectedRoute>; }
