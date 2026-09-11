import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext.jsx";
import Icon from "./Icon.jsx";

export default function Navbar() {
  const { user, logout, switchAccountType } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { setOpen(false); setError(""); }, [pathname]);
  const sell = async () => {
    if (!user) return router.push("/register");
    if (user.accountType === "seller" || user.isAdmin) return router.push("/create");
    setSwitching(true);
    try { await switchAccountType("seller"); router.push("/create"); }
    catch (err) { setError(err.response?.data?.message || "Couldn't switch your account. Please try again."); }
    finally { setSwitching(false); }
  };
  return <>
    <div className="announcement"><div className="page-width"><span><Icon name="leaf" size={14} /> Good for your budget. Better for the planet.</span><span className="announcement-right">Made for your campus community <Icon name="arrow" size={14} /></span></div></div>
    <header className="site-header">
      <div className="page-width nav-main">
        <Link href="/" className="brand" aria-label="UniShop home"><span className="brand-symbol"><Icon name="bag" size={24} /></span>uni<span>shop</span><span className="brand-dot">.</span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavItem href="/" active={pathname === "/"}>Marketplace</NavItem>
          {user && <><NavItem href="/wishlist" active={pathname === "/wishlist"}>Wishlist</NavItem><NavItem href="/dashboard" active={pathname === "/dashboard"}>My dashboard</NavItem></>}
          {user?.isAdmin && <NavItem href="/admin" active={pathname === "/admin"}>Admin</NavItem>}
        </nav>
        <div className="nav-actions">
          {user ? <button className="account-button" onClick={() => { logout(); router.push("/"); }} title="Log out"><span className="avatar avatar-small">{user.name?.charAt(0)}</span><span className="desktop-only">Log out</span></button> : <Link href="/login" className="login-link"><Icon name="user" size={18} /><span>Log in</span></Link>}
          <button className="button button-primary nav-sell" onClick={sell} disabled={switching}><Icon name="plus" size={18} /><span>{switching ? "One moment…" : "Sell an item"}</span></button>
          <button className="icon-button mobile-menu-button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
        </div>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-nav page-width" aria-label="Mobile navigation"><NavItem href="/" active={pathname === "/"}>Marketplace</NavItem>{user && <><NavItem href="/wishlist" active={pathname === "/wishlist"}>Wishlist</NavItem><NavItem href="/dashboard" active={pathname === "/dashboard"}>My dashboard</NavItem></>}{user?.isAdmin && <NavItem href="/admin" active={pathname === "/admin"}>Admin</NavItem>}{!user && <NavItem href="/register" active={pathname === "/register"}>Create an account</NavItem>}</nav>}
      {error && <p className="page-width nav-error" role="alert">{error}</p>}
    </header>
  </>;
}

function NavItem({ href, active, children }) {
  return <Link href={href} className={active ? "active" : undefined}>{children}</Link>;
}
