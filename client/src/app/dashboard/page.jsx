"use client";
import Dashboard from "../../views/Dashboard.jsx";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
export default function Page() { return <ProtectedRoute><Dashboard /></ProtectedRoute>; }
