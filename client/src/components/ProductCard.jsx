import React, { useState } from "react";
import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton.jsx";
import Icon, { categoryIcons } from "./Icon.jsx";

export default function ProductCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="product-card">
      <div className="product-image">
        <Link to={`/products/${product._id}`} aria-label={`View ${product.title}`}>
          {product.images?.[0] && !imageFailed ? <img src={product.images[0]} alt={product.title} loading="lazy" onError={() => setImageFailed(true)} /> : <div className="product-placeholder"><Icon name={categoryIcons[product.category] || "box"} size={58}/><span>No photo yet</span></div>}
        </Link>
        <span className={`condition-badge ${product.status === "sold" ? "is-sold" : ""}`}>{product.status === "sold" ? "Sold" : product.condition}</span>
        <WishlistButton productId={product._id} className="product-heart"/>
      </div>
      <Link to={`/products/${product._id}`} className="product-content">
        <p className="product-category">{product.category}</p>
        <h3>{product.title}</h3>
        <p className="product-price">{product.price === 0 ? "Free" : `$${Number(product.price).toLocaleString()}`}</p>
        <div className="product-meta"><span><Icon name="pin" size={13}/>{product.location || product.seller?.university || "Campus listing"}</span><Icon name="arrow" size={16}/></div>
      </Link>
    </article>
  );
}
