import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="group block rounded-2xl overflow-hidden border border-campus-navy/10 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="aspect-square bg-campus-navy/5 overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-campus-navy/30 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs uppercase tracking-wide text-campus-navy/50">{product.category}</p>
        <h3 className="font-display font-semibold text-campus-navy truncate">{product.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="font-semibold text-campus-gold">${product.price}</span>
          <span className="text-xs text-campus-navy/50">{product.condition}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
