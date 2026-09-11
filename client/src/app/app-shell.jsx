"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function AppShell({ children }) {
  const pathname = usePathname();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);

  return <div className="min-h-screen flex flex-col"><Navbar /><main className="flex-1">{children}</main><Footer /></div>;
}
