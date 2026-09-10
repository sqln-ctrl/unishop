import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="page-width standard-page">
      <div className="breadcrumb"><Link to="/">Marketplace</Link><Icon name="chevron" size={12}/><span>Create a listing</span></div>
      <div className="page-heading"><div><span className="eyebrow">PASS IT ON. MAKE SOME ROOM.</span>
      <h1 className="text-2xl font-bold mb-1">List an item</h1>
      <p className="text-campus-navy/60 mb-6 text-sm">
        Give your listing a clear title and honest condition — it sells faster.
      </p>

      </div></div>
      <div className="listing-layout"><div className="form-card">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="form-section-title"><span className="step-number">01</span> Make a great first impression</h2>
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
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-campus-navy/80 text-white text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length < MAX_IMAGES && (
            <label className="upload-zone mt-2">
              <Icon name="upload" size={28}/>
              {uploading ? "Uploading your photos…" : "Choose photos for your listing"}
              <small>JPEG, PNG, WEBP or GIF · Up to 5MB each</small>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleFileSelect}
                disabled={uploading}
                className="sr-only"
              />
            </label>
          )}
          <p className="text-xs text-slate-500 mt-1">Up to {MAX_IMAGES} images, 5MB each.</p>
        </div>

        <h2 className="form-section-title !mt-8"><span className="step-number">02</span> Tell us about your item</h2>
        <div>
          <label htmlFor="listing-title" className="text-sm font-medium">Title</label>
          <input
            id="listing-title" name="title"
            placeholder="e.g. Calculus textbook, like new"
            required
            value={form.title}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
        </div>
        <div>
          <label htmlFor="listing-description" className="text-sm font-medium">Description</label>
          <textarea
            id="listing-description" name="description"
            placeholder="Share the details that will help someone make it theirs…"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="listing-price" className="text-sm font-medium">Price ($)</label>
            <input
              type="number"
              id="listing-price" name="price"
              min="0"
              required
              value={form.price}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
            />
          </div>
          <div>
            <label htmlFor="listing-condition" className="text-sm font-medium">Condition</label>
            <select
              id="listing-condition" name="condition"
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
          <label htmlFor="listing-category" className="text-sm font-medium">Category</label>
          <select
            id="listing-category" name="category"
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
          <label htmlFor="listing-location" className="text-sm font-medium">Campus / location</label>
          <input
            id="listing-location" name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Hostel Block C"
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
        </div>
        <div>
          <label htmlFor="listing-whatsapp" className="text-sm font-medium">WhatsApp number</label>
          <input
            type="tel"
            id="listing-whatsapp" name="whatsapp"
            required
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="+923001234567"
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
          <p className="text-xs text-campus-navy/40 mt-1">
            Include your country code. Buyers will use this to message you directly on
            WhatsApp.
          </p>
        </div>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="button button-primary w-full !mt-7"
        >
          {submitting ? "Publishing..." : "Publish listing"}
        </button>
      </form>
      </div><aside className="listing-tips"><Icon name="bag" size={28}/><h2>A little effort. A better listing.</h2><div className="listing-tip"><Icon name="image" size={18}/><div><strong>Let your photos do the talking</strong><p>Use natural light, a clear background, and a few different angles.</p></div></div><div className="listing-tip"><Icon name="pencil" size={18}/><div><strong>Keep it clear and honest</strong><p>Include the brand, condition, and any details you would want to know.</p></div></div><div className="listing-tip"><Icon name="chat" size={18}/><div><strong>Be ready to connect</strong><p>Buyers will reach out to your WhatsApp number to arrange the details.</p></div></div></aside></div>
    </div>
  );
};

export default CreateProduct;
