import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productService.js";
import { CATEGORIES, CONDITIONS } from "../utils/categories.js";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const CreateProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: CATEGORIES[0],
    condition: CONDITIONS[0],
    location: "",
    whatsappNumber: "",
  });
  const [images, setImages] = useState([]);
  const imagesRef = useRef([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  imagesRef.current = images;

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    setError("");
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images`);
      return;
    }

    const next = [];
    for (const file of incoming.slice(0, remaining)) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("Each image must be 5MB or smaller");
        continue;
      }
      next.push({ file, preview: URL.createObjectURL(file) });
    }

    if (incoming.length > remaining) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images`);
    }

    if (next.length) setImages((prev) => [...prev, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("price", form.price);
      payload.append("category", form.category);
      payload.append("condition", form.condition);
      payload.append("location", form.location);
      payload.append("whatsappNumber", form.whatsappNumber);
      images.forEach((item) => payload.append("images", item.file));

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
          <label className="text-sm font-medium">WhatsApp number</label>
          <input
            type="tel"
            name="whatsappNumber"
            required
            value={form.whatsappNumber}
            onChange={handleChange}
            placeholder="e.g. 03001234567 or +92 300 1234567"
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
          <p className="text-xs text-campus-navy/40 mt-1">
            Buyers will contact you on this number through WhatsApp.
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">Product photos</label>
          <p className="text-xs text-campus-navy/40 mt-0.5 mb-2">
            Upload up to {MAX_IMAGES} images from your computer or phone (5MB each).
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <div className="grid grid-cols-3 gap-2">
            {images.map((item, index) => (
              <div key={item.preview} className="relative aspect-square rounded-lg overflow-hidden bg-campus-navy/5">
                <img src={item.preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-xs leading-none"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border border-dashed border-campus-navy/25 text-campus-navy/60 text-sm hover:border-campus-gold hover:text-campus-navy"
              >
                + Add photo
              </button>
            )}
          </div>
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
