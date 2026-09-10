import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
export default function Footer() {
  return <footer className="site-footer"><div className="page-width footer-main"><div><Link to="/" className="brand"><span className="brand-symbol"><Icon name="bag" size={21}/></span>uni<span>shop</span><span className="brand-dot">.</span></Link><p>Less spending. More living.<br/>Your campus marketplace.</p></div><div className="footer-links"><Link to="/">Explore the marketplace</Link><Link to="/create">Sell an item</Link><Link to="/wishlist">Your wishlist</Link></div><div className="footer-note"><Icon name="leaf" size={23}/><p>A second home for your things.<br/><strong>A better way to shop.</strong></p></div></div><div className="page-width footer-bottom"><span>© {new Date().getFullYear()} UniShop</span><span>Buy. Sell. Pass it on.</span></div></footer>;
}
