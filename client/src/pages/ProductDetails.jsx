import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById, deleteProduct, markAsSold } from "../services/productService.js";
import { useAuth } from "../context/AuthContext.jsx";
import WishlistButton from "../components/WishlistButton.jsx";
import ReportModal from "../components/ReportModal.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const isOwner = user && product && product.seller?._id === user._id;

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;
    await deleteProduct(id);
    navigate("/dashboard");
  };

  const handleMarkSold = async () => {
    const updated = await markAsSold(id);
    setProduct(updated);
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-campus-navy/50">Loading...</div>;
  if (!product) return <div className="max-w-4xl mx-auto px-4 py-16">Listing not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div className="aspect-square rounded-2xl bg-campus-navy/5 overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-campus-navy/30">
            No image
          </div>
        )}
      </div>

      <div>
        <div className="flex items-start justify-between">
          <p className="text-xs uppercase tracking-wide text-campus-navy/50">{product.category}</p>
          <WishlistButton productId={product._id} className="w-9 h-9 border border-campus-navy/10" />
        </div>
        <h1 className="text-2xl font-bold mt-1">{product.title}</h1>
        <p className="text-2xl font-semibold text-campus-gold mt-2">${product.price}</p>

        {product.status === "sold" && (
          <span className="inline-block mt-2 text-xs font-medium bg-campus-navy/10 text-campus-navy px-2 py-1 rounded-full">
            Sold
          </span>
        )}

        <div className="mt-4 text-sm text-campus-navy/70 space-y-1">
          <p>Condition: {product.condition}</p>
          {product.location && <p>Location: {product.location}</p>}
          <p>{product.views} views</p>
        </div>

        <p className="mt-4 text-campus-navy/80 leading-relaxed">{product.description}</p>

        <div className="mt-6 pt-6 border-t border-campus-navy/10">
          <p className="text-sm text-campus-navy/50 mb-1">Seller</p>
          <Link to={`/`} className="font-medium hover:text-campus-gold">
            {product.seller?.name} · {product.seller?.university}
          </Link>
        </div>

        {isOwner ? (
          <div className="mt-6 flex gap-3">
            {product.status !== "sold" && (
              <button
                onClick={handleMarkSold}
                className="rounded-full bg-campus-navy text-campus-cream px-4 py-2 text-sm font-medium"
              >
                Mark as sold
              </button>
            )}
            <button
              onClick={handleDelete}
              className="rounded-full border border-red-300 text-red-600 px-4 py-2 text-sm font-medium"
            >
              Delete listing
            </button>
          </div>
        ) : (
          user && (
            <div className="mt-6 flex items-center gap-4">
              <button className="rounded-full bg-campus-navy text-campus-cream px-5 py-2.5 text-sm font-medium">
                Message seller
              </button>
              <button
                onClick={() => setShowReport(true)}
                className="text-sm text-campus-navy/50 hover:text-red-600 underline"
              >
                Report listing
              </button>
            </div>
          )
        )}
      </div>

      {showReport && (
        <ReportModal productId={product._id} onClose={() => setShowReport(false)} />
      )}
    </div>
  );
};

export default ProductDetails;