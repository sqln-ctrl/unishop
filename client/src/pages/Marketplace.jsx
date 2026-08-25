import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { getProducts } from "../services/productService.js";
import { CATEGORIES, CONDITIONS } from "../utils/categories.js";

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", category: "", condition: "", sort: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        Object.entries(filters).forEach(([k, v]) => {
          if (v) params[k] = v;
        });
        const data = await getProducts(params);
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Campus Marketplace</h1>
        <p className="text-campus-navy/60 mt-1">
          Textbooks, electronics, hostel gear, and more — straight from your classmates.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search listings..."
          value={filters.search}
          onChange={handleFilterChange}
          className="flex-1 min-w-[200px] rounded-lg border border-campus-navy/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-campus-gold"
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="rounded-lg border border-campus-navy/20 px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="condition"
          value={filters.condition}
          onChange={handleFilterChange}
          className="rounded-lg border border-campus-navy/20 px-3 py-2 text-sm"
        >
          <option value="">Any condition</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="rounded-lg border border-campus-navy/20 px-3 py-2 text-sm"
        >
          <option value="">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      {loading ? (
        <p className="text-campus-navy/50 text-sm">Loading listings...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-campus-navy/50">
          No listings match your filters yet.
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

export default Marketplace;
