import React, { useEffect, useState } from "react";
import { Link } from "../lib/router.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserListings } from "../services/productService.js";
import ProductCard from "../components/ProductCard.jsx";
import Icon from "../components/Icon.jsx";

export default function Dashboard() {
  const { user, switchAccountType } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState("");
  const isSeller = user?.accountType === "seller" || user?.isAdmin;
  useEffect(() => {
    let active = true;
    if (!isSeller) { setLoading(false); return; }
    setLoading(true);
    getUserListings(user._id).then((data) => { if (active) { setListings(data); setError(""); } }).catch(() => { if (active) setError("Couldn't load your listings. Please refresh to try again."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user, isSeller]);
  const activeListings = listings.filter((item) => item.status === "available");
  const sold = listings.filter((item) => item.status === "sold");
  const becomeSeller = async () => {
    setSwitching(true);
    try { await switchAccountType("seller"); setError(""); }
    catch (err) { setError(err.response?.data?.message || "Couldn't switch your account. Please try again."); }
    finally { setSwitching(false); }
  };
  return <div className="page-width standard-page">
    <div className="page-heading"><div><span className="eyebrow">YOUR LITTLE CORNER OF CAMPUS</span><h1>Hey, {user?.name?.split(" ")[0]}<span className="text-campus-gold">.</span></h1><p>{user?.university} · <span className="capitalize">{user?.accountType} account</span></p></div>{isSeller && <Link to="/create" className="button button-primary"><Icon name="plus" size={17}/> New listing</Link>}</div>
    {error && <p className="inline-error" role="alert">{error}</p>}
    {!isSeller ? <div className="empty-state"><span className="empty-icon"><Icon name="bag" size={32}/></span><h3>Your next chapter starts with a listing</h3><p>Got a textbook you've finished or something you no longer use? Become a seller and help it find a new home.</p><button className="button button-primary" onClick={becomeSeller} disabled={switching}>{switching ? "Switching…" : "Become a seller"}<Icon name="arrow" size={17}/></button></div> : <>
      <div className="dashboard-stats">{[["bag", "Active listings", activeListings.length], ["check", "Items sold", sold.length], ["eye", "Total listing views", listings.reduce((sum, item) => sum + (item.views || 0), 0)]].map(([icon,label,value]) => <div className="dashboard-stat" key={label}><span className="stat-icon"><Icon name={icon} size={21}/></span><div><strong>{loading ? "—" : value}</strong><small>{label}</small></div></div>)}</div>
      <section className="dashboard-section"><h2>Your active listings <span className="count-badge">{activeListings.length}</span></h2>{loading ? <div className="empty-state" role="status">Loading your listings…</div> : activeListings.length === 0 ? <div className="empty-state"><span className="empty-icon"><Icon name="box" size={30}/></span><h3>Let's put something out there</h3><p>Your active listings will live here. Take a few photos and get your first item ready for its next owner.</p><Link to="/create" className="button button-primary"><Icon name="plus" size={17}/> Create a listing</Link></div> : <div className="product-grid">{activeListings.map((product) => <ProductCard key={product._id} product={product}/>)}</div>}</section>
      {sold.length > 0 && <section className="dashboard-section"><h2>Found a new home <span className="count-badge">{sold.length}</span></h2><div className="product-grid">{sold.map((product) => <ProductCard key={product._id} product={product}/>)}</div></section>}
    </>}
  </div>;
}
