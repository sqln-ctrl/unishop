import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productService.js";
import { CATEGORIES, CONDITIONS } from "../utils/categories.js";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: CATEGORIES[0],
    condition: CONDITIONS[0],
    location: "",
    images: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        images: form.images ? form.images.split(",").map((s) => s.trim()) : [],
      };
      const product = await createProduct(payload);
      navigate(`/products/${product._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-1">List an item</h1>
      <p className="text-campus-navy/60 mb-6 text-sm">
        Give your listing a clear title and honest condition — it sells faster.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Price ($)</label>
            <input
              type="number"
              name="price"
              min="0"
              required
              value={form.price}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Condition</label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Campus / location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Hostel Block C"
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Image URLs (comma-separated)</label>
          <input
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="https://..., https://..."
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
          <p className="text-xs text-campus-navy/40 mt-1">
            File uploads (Cloudinary) come in Phase 2 — paste hosted image links for now.
          </p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-campus-navy text-campus-cream py-2.5 font-medium hover:bg-campus-navy/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "Publishing..." : "Publish listing"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
