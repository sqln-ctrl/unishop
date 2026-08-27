import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { getWishlist } from "../services/wishlistService.js";

const Wishlist = () => {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getWishlist();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    // Re-fetch whenever the wishlist changes elsewhere (e.g. a heart toggle
    // on the marketplace grid), so removals disappear from this page too.
  }, [wishlistIds]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-1">Your wishlist</h1>
      <p className="text-campus-navy/60 mb-8">Items you've saved for later.</p>

      {loading ? (
        <p className="text-campus-navy/50 text-sm">Loading...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-campus-navy/50">
          Nothing saved yet.{" "}
          <Link to="/" className="text-campus-gold font-medium">
            Browse the marketplace
          </Link>
          .
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;