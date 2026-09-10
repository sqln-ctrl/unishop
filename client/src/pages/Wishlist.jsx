import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import Icon from "../components/Icon.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { getWishlist } from "../services/wishlistService.js";

export default function Wishlist() {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    getWishlist().then((data) => { if (active) { setProducts(data); setError(""); } }).catch(() => { if (active) setError("Couldn't load your wishlist. Please refresh to try again."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [wishlistIds]);
  return <div className="page-width standard-page">
    <div className="page-heading"><div><span className="eyebrow">A FEW THINGS YOU LOVE</span><h1>Your wishlist<span className="count-badge">{products.length}</span></h1><p>All your favorite finds, saved in one little space.</p></div><Link to="/" className="button button-secondary">Keep exploring <Icon name="arrow" size={16}/></Link></div>
    {error && <div className="inline-error" role="alert">{error}</div>}
    {loading ? <div className="empty-state" role="status">Gathering your favorites…</div> : products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product._id} product={product}/>)}</div> : !error && <div className="empty-state"><span className="empty-icon"><Icon name="heart" size={31}/></span><h3>Something will catch your eye</h3><p>Tap the heart on any listing to save it here. Your next favorite thing might be just around the corner.</p><Link to="/" className="button button-primary">Discover the marketplace <Icon name="arrow" size={17}/></Link></div>}
  </div>;
}
