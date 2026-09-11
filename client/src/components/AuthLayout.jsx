import React from "react";
import Link from "next/link";
import HeroArtwork from "./HeroArtwork.jsx";
import Icon from "./Icon.jsx";

export default function AuthLayout({ children, register = false }) {
  return <div className="auth-page page-width"><aside className="auth-story"><Link href="/" className="eyebrow"><Icon name="arrow" className="rotate-180" size={16}/> BACK TO MARKETPLACE</Link><div><span className="eyebrow">A LITTLE MORE COMMUNITY.</span><h2>Your next great find<br/>is closer than you think.</h2><p>Join a campus full of possibilities. Find what you need, pass on what you don't, and make a little room for more.</p></div><HeroArtwork/><div className="auth-benefit"><Icon name={register ? "leaf" : "bag"} size={22}/><span>{register ? "A fresh start for you. A second life for your things." : "Good things happen when a campus comes together."}</span></div></aside><section className="auth-form form-card">{children}</section></div>;
}
