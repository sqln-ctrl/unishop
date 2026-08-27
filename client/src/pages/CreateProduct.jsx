import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productService.js";
import { uploadImages } from "../services/uploadService.js";
import { CATEGORIES, CONDITIONS } from "../utils/categories.js";

const MAX_IMAGES = 5;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: CATEGORIES[0],
    condition: CONDITIONS[0],
    location: "",
    whatsapp: "",
  });
  const [images, setImages] = useState([]); // hosted URLs returned by Cloudinary
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      setError(`You can upload up to ${MAX_IMAGES} images`);
      e.target.value = "";
      return;
    }

    setError("");
    setUploading(true);
    try {
      const urls = await uploadImages(files);
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url) => setImages(images.filter((img) => img !== url));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic sanity check: needs at least a country code + number, digits only
    // once we strip spaces/dashes/parentheses/plus sign.
    const digitsOnly = form.whatsapp.replace(/[^\d]/g, "");
    if (digitsOnly.length < 8) {
      setError("Enter a valid WhatsApp number, including country code (e.g. +923001234567)");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form, price: Number(form.price), images };
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
          <label className="text-sm font-medium">Photos</label>

          {images.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {images.map((url) => (
                <div key={url} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-campus-navy/80 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length < MAX_IMAGES && (
            <label className="mt-2 flex items-center justify-center h-24 rounded-lg border border-dashed border-campus-navy/30 text-sm text-campus-navy/50 cursor-pointer hover:border-campus-gold hover:text-campus-navy transition-colors">
              {uploading ? "Uploading..." : "Click to add photos"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
          <p className="text-xs text-campus-navy/40 mt-1">Up to {MAX_IMAGES} images, 5MB each.</p>
        </div>

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
          <label className="text-sm font-medium">WhatsApp number</label>
          <input
            type="tel"
            name="whatsapp"
            required
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="+923001234567"
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
          <p className="text-xs text-campus-navy/40 mt-1">
            Include your country code. Buyers will use this to message you directly on
            WhatsApp — it isn't shown as text anywhere on the listing.
          </p>
        </div>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full rounded-full bg-campus-navy text-campus-cream py-2.5 font-medium hover:bg-campus-navy/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "Publishing..." : "Publish listing"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;