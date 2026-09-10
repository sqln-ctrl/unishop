import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById, deleteProduct, markAsSold } from "../services/productService.js";
import { useAuth } from "../context/AuthContext.jsx";
import WishlistButton from "../components/WishlistButton.jsx";
import ReportModal from "../components/ReportModal.jsx";
import Icon from "../components/Icon.jsx";
import { whatsappChatUrl } from "../utils/whatsapp.js";

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true); setProduct(null); setSelectedImage(0); setImageFailed(false); setError("");
    getProductById(id).then((data) => { if (active) setProduct(data); }).catch(() => { if (active) setError("This listing couldn't be loaded. It may no longer be available."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  const isOwner = user && product?.seller?._id === user._id;
  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;
    setBusy(true);
    try { await deleteProduct(id); navigate("/dashboard"); }
    catch (err) { setError(err.response?.data?.message || "Couldn't delete the listing."); }
    finally { setBusy(false); }
  };
  const handleSold = async () => {
    setBusy(true);
    try { setProduct(await markAsSold(id)); setError(""); }
    catch (err) { setError(err.response?.data?.message || "Couldn't update the listing."); }
    finally { setBusy(false); }
  };
  if (loading) return <div className="page-width standard-page"><div className="empty-state" role="status">Getting your find ready…</div></div>;
  if (!product) return <div className="page-width standard-page"><div className="empty-state"><span className="empty-icon"><Icon name="search" size={32}/></span><h1 className="text-xl font-bold">This find isn't here right now</h1><p>{error}</p><Link to="/" className="button button-primary">Back to the marketplace</Link></div></div>;
  return <div className="page-width standard-page">
    <div className="breadcrumb"><Link to="/">Marketplace</Link><Icon name="chevron" size={12}/><span>{product.category}</span><Icon name="chevron" size={12}/><span>{product.title}</span></div>
    {error && <p className="inline-error" role="alert">{error}</p>}
    <div className="detail-grid">
      <div><div className="detail-image">{product.images?.[selectedImage] && !imageFailed ? <img src={product.images[selectedImage]} alt={product.title} onError={() => setImageFailed(true)}/> : <div className="product-placeholder"><Icon name="image" size={65}/><span>No photo available</span></div>}</div>
      {product.images?.length > 1 && <div className="detail-thumbnails">{product.images.map((url, index) => <button key={url + index} className={selectedImage === index ? "selected" : ""} aria-label={`View photo ${index + 1}`} aria-pressed={selectedImage === index} onClick={() => { setSelectedImage(index); setImageFailed(false); }}><img src={url} alt={`Photo ${index + 1} of ${product.title}`}/></button>)}</div>}
      <p className="field-hint mt-5 flex items-center gap-2"><Icon name="leaf" size={16}/> A new home for a good thing.</p></div>
      <div className="detail-copy"><div className="detail-topline"><span className="detail-category">{product.category}</span><WishlistButton productId={product._id} className="w-9 h-9 border border-slate-200"/></div>
        <h1>{product.title}</h1><p className="detail-price">{product.price === 0 ? "Free" : `$${Number(product.price).toLocaleString()}`}</p>
        <div className="detail-facts"><span><Icon name="check" size={14}/>{product.status === "sold" ? "Sold" : product.condition}</span>{product.location && <span><Icon name="pin" size={14}/>{product.location}</span>}<span><Icon name="eye" size={14}/>{product.views} views</span></div>
        <h2>A little about this find</h2><p className="detail-description">{product.description}</p>
        <div className="seller-panel"><span className="avatar">{product.seller?.name?.charAt(0) || "S"}</span><div><small>LISTED BY</small><strong>{product.seller?.name || "Campus seller"}</strong><small>{product.seller?.university}</small></div></div>
        {isOwner ? <div className="detail-actions">{product.status !== "sold" && <button className="button button-primary" disabled={busy} onClick={handleSold}><Icon name="check" size={17}/> Mark as sold</button>}<button className="button button-danger" disabled={busy} onClick={handleDelete}>Delete listing</button></div> : user ? <><div className="detail-actions">{product.whatsapp && <a className="button button-primary" href={whatsappChatUrl(product.whatsapp, product.title)} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18}/> Message seller<Icon name="arrow" size={17}/></a>}</div><p className="field-hint text-center mt-3">Connect directly on WhatsApp to arrange the details.</p><button className="detail-report" onClick={() => setShowReport(true)}>Something doesn't look right? Report this listing</button></> : <div className="detail-actions"><Link to="/login" className="button button-primary"><Icon name="chat" size={17}/> Log in to contact the seller</Link></div>}
      </div>
    </div>
    {showReport && <ReportModal productId={product._id} onClose={() => setShowReport(false)}/>}
  </div>;
}
