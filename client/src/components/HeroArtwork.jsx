import React from "react";

export default function HeroArtwork() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
      <svg viewBox="0 0 600 420" className="market-illustration" fill="none">
        <defs>
          <linearGradient id="screen" x1="156" y1="100" x2="420" y2="300" gradientUnits="userSpaceOnUse"><stop stopColor="#214CE6"/><stop offset="1" stopColor="#6A94FF"/></linearGradient>
          <linearGradient id="metal" x1="110" y1="260" x2="425" y2="330" gradientUnits="userSpaceOnUse"><stop stopColor="#F5F8FF"/><stop offset="1" stopColor="#9BAED2"/></linearGradient>
          <linearGradient id="headphones" x1="405" y1="80" x2="535" y2="250" gradientUnits="userSpaceOnUse"><stop stopColor="#F9FBFF"/><stop offset="1" stopColor="#C1CFE9"/></linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="210%"><feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#284A9E" floodOpacity=".16"/></filter>
        </defs>
        <ellipse cx="300" cy="345" rx="205" ry="22" fill="#3060BE" opacity=".08"/>
        <g filter="url(#shadow)" transform="rotate(-8 270 220)">
          <rect x="117" y="97" width="292" height="195" rx="14" fill="#152449"/>
          <rect x="126" y="106" width="274" height="177" rx="7" fill="url(#screen)"/>
          <circle cx="263" cy="101" r="2" fill="#7382A3"/>
          <path d="M168 283c18-68 75-149 158-177h74v177H168Z" fill="#98B7FF" opacity=".22"/>
          <path d="M250 283c10-48 70-105 150-117v117H250Z" fill="#DCE7FF" opacity=".2"/>
          <rect x="171" y="147" width="122" height="90" rx="9" fill="white" fillOpacity=".95" transform="rotate(5 171 147)"/>
          <rect x="184" y="164" width="47" height="43" rx="5" fill="#E8EEFF" transform="rotate(5 184 164)"/>
          <path d="m199 189 10-10 11 13m-13-12v21" stroke="#4F74E8" strokeWidth="3" strokeLinecap="round"/>
          <path d="m244 174 35 3m-37 10 25 2m-27 10 31 3" stroke="#A4B5DA" strokeWidth="4" strokeLinecap="round"/>
          <rect x="183" y="220" width="88" height="5" rx="2.5" fill="#3464EC" transform="rotate(5 183 220)"/>
          <path d="M117 291h292l36 30c4 4 1 10-5 10H85c-6 0-9-6-5-10l37-30Z" fill="url(#metal)"/>
          <path d="M212 291h95l8 10H204l8-10Z" fill="#91A7CC"/>
          <path d="M86 328h351" stroke="#91A7CC" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <g filter="url(#shadow)" transform="rotate(15 459 162)">
          <path d="M405 176v-48a55 55 0 0 1 110 0v48" stroke="#C1CEE5" strokeWidth="20" strokeLinecap="round"/>
          <path d="M405 149v-21a55 55 0 0 1 110 0v21" stroke="url(#headphones)" strokeWidth="15" strokeLinecap="round"/>
          <rect x="387" y="150" width="34" height="65" rx="16" fill="#F1F5FF"/>
          <rect x="414" y="154" width="12" height="57" rx="6" fill="#738BB6"/>
          <rect x="499" y="150" width="34" height="65" rx="16" fill="#F1F5FF"/>
          <rect x="494" y="154" width="12" height="57" rx="6" fill="#738BB6"/>
        </g>
        <g filter="url(#shadow)" transform="rotate(7 454 299)">
          <rect x="386" y="314" width="158" height="27" rx="5" fill="#2254C7"/>
          <path d="M400 318h140v17H400" fill="#F2F6FF"/>
          <path d="M408 323h128m-128 6h128" stroke="#D9E1F1" strokeWidth="2"/>
          <rect x="373" y="281" width="158" height="30" rx="5" fill="#80ABFF"/>
          <path d="M386 286h141v19H386" fill="white"/>
          <path d="M394 292h126m-126 6h126" stroke="#DBE5F8" strokeWidth="2"/>
          <rect x="388" y="259" width="153" height="20" rx="4" fill="#D7E5FF"/>
          <path d="M406 259v20" stroke="#AAC3F3" strokeWidth="3"/>
        </g>
        <path d="m103 89 3 10 10 3-10 3-3 10-3-10-10-3 10-3 3-10Zm431 150 3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9Z" fill="#628FF4"/>
        <circle cx="337" cy="61" r="5" fill="#8DAFFD"/><circle cx="74" cy="270" r="4" fill="#8DAFFD"/>
      </svg>
      <div className="art-label"><span className="art-label-icon">↗</span><div><strong>Good finds. Great value.</strong><span>A little less new. A lot more you.</span></div></div>
    </div>
  );
}
