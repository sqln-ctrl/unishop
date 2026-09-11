import React, { useEffect, useState } from "react";
import { Link } from "../lib/router.jsx";
import ProductCard from "../components/ProductCard.jsx";
import HeroArtwork from "../components/HeroArtwork.jsx";
import Icon, { categoryIcons } from "../components/Icon.jsx";
import { getProducts } from "../services/productService.js";
import { CATEGORIES, CONDITIONS } from "../utils/categories.js";

const initialFilters = { search: "", category: "", condition: "", sort: "" };
export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
        const data = await getProducts(params);
        if (active) { setProducts(data.products); setError(""); }
      } catch (err) { if (active) setError("We couldn't load the marketplace. Please try again."); }
      finally { if (active) setLoading(false); }
    }, 300);
    return () => { active = false; clearTimeout(timer); };
  }, [filters, retry]);
  const change = (e) => setFilters((current) => ({ ...current, [e.target.name]: e.target.value }));
  const filtered = Object.values(filters).some(Boolean);
  return (
    <div className="marketplace-page page-width">
      <section className="market-hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="status-dot"/> YOUR CAMPUS. YOUR MARKETPLACE.</span>
          <h1>Big finds.<br/><span>Student-sized prices.</span></h1>
          <p>From next semester's textbooks to your next favorite thing. Buy and sell with the students around you.</p>
          <div className="hero-actions"><a href="#listings" className="button button-primary">Explore the marketplace <Icon name="arrow" size={18}/></a><Link to="/create" className="hero-secondary">Start selling <Icon name="arrow" size={16}/></Link></div>
          <div className="hero-footnote"><Icon name="pin" size={15}/><span>Find it nearby. Make it yours.</span></div>
        </div>
        <HeroArtwork/>
      </section>
      <section className="category-section" aria-labelledby="category-heading">
        <div className="section-heading"><h2 id="category-heading">What are you looking for?</h2><button className="text-button" onClick={() => setFilters(initialFilters)}>View everything <Icon name="arrow" size={16}/></button></div>
        <div className="category-grid">{CATEGORIES.map((category) => <button key={category} className={`category-tile ${filters.category === category ? "selected" : ""}`} aria-pressed={filters.category === category} onClick={() => setFilters((current) => ({ ...current, category: current.category === category ? "" : category }))}><span className="category-icon"><Icon name={categoryIcons[category]} size={25}/></span><span>{category}</span></button>)}</div>
      </section>
      <section id="listings" className="listings-section" aria-labelledby="listings-heading">
        <div className="section-heading listings-title"><div><span className="eyebrow">GOOD THINGS, WAITING FOR YOU</span><h2 id="listings-heading">{filters.category || "Fresh on campus"}</h2><p>Discover your next great find from the community.</p></div><span className="live-label"><span className="status-dot"/> The latest listings</span></div>
        <div className="market-filters">
          <label className="search-field"><Icon name="search" size={20}/><input type="search" name="search" aria-label="Search listings" placeholder="What are you looking for?" value={filters.search} onChange={change}/></label>
          <div className="filter-select"><Icon name="grid" size={17}/><select name="category" aria-label="Filter by category" value={filters.category} onChange={change}><option value="">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="filter-select"><Icon name="sliders" size={17}/><select name="condition" aria-label="Filter by condition" value={filters.condition} onChange={change}><option value="">Any condition</option>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="filter-select sort-select"><select name="sort" aria-label="Sort listings" value={filters.sort} onChange={change}><option value="">Newest first</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></div>
        </div>
        {filtered && <div className="filter-summary"><span>Showing your selected results</span><button className="text-button" onClick={() => setFilters(initialFilters)}>Clear filters <Icon name="close" size={14}/></button></div>}
        {loading ? <div className="product-grid" aria-label="Loading listings" aria-busy="true">{Array.from({ length: 4 }, (_, i) => <div className="skeleton-card" key={i}><div/><span/><span/></div>)}</div> : error ? <div className="empty-state" role="alert"><span className="empty-icon"><Icon name="box" size={30}/></span><h3>The marketplace is taking a moment</h3><p>{error}</p><button className="button button-primary" onClick={() => setRetry((value) => value + 1)}>Try again</button></div> : products.length === 0 ? <div className="empty-state"><span className="empty-icon"><Icon name={filtered ? "search" : "bag"} size={32}/></span><h3>{filtered ? "No finds just yet" : "Good things start with a first listing"}</h3><p>{filtered ? "Try a different search or clear your filters to explore more." : "Have something you no longer need? Give it a new home on campus."}</p>{filtered ? <button className="button button-secondary" onClick={() => setFilters(initialFilters)}>Clear filters</button> : <Link to="/create" className="button button-primary"><Icon name="plus" size={17}/> List your first item</Link>}</div> : <div className="product-grid">{products.map((product) => <ProductCard key={product._id} product={product}/>)}</div>}
      </section>
      <section className="sell-banner"><div className="sell-banner-icon"><Icon name="bag" size={34}/></div><div><span className="eyebrow">MAKE ROOM FOR WHAT'S NEXT</span><h2>Your old favorite. Someone's new find.</h2><p>Turn the things you don't use into something you can.</p></div><Link to="/create" className="button button-primary">Start selling <Icon name="arrow" size={18}/></Link></section>
      <div className="benefits-row"><div><Icon name="pin"/><span><strong>Right around campus</strong><small>Great finds, closer to you</small></span></div><div><Icon name="chat"/><span><strong>Connect directly</strong><small>Talk to sellers on WhatsApp</small></span></div><div><Icon name="leaf"/><span><strong>Keep good things going</strong><small>Buy pre-loved. Make a difference.</small></span></div></div>
    </div>
  );
}
