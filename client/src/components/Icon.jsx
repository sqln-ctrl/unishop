import React from "react";

const paths = {
  bag: <><path d="M5 7h14l1 14H4L5 7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,
  arrow: <><path d="M4 12h16m-6-6 6 6-6 6"/></>,
  chevron: <path d="m9 5 7 7-7 7"/>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
  plus: <path d="M12 5v14M5 12h14"/>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  book: <><path d="M12 5C8 2 5 3 2 4v15c3-1 6-2 10 1 4-3 7-2 10-1V4c-3-1-6-2-10 1v15"/><path d="M5 7h3m8 0h3M5 11h3m8 0h3"/></>,
  laptop: <><rect x="4" y="3" width="16" height="13" rx="2"/><path d="m4 16-2 4h20l-2-4M9 20h6"/></>,
  shirt: <path d="m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4a4 4 0 0 1-8 0Z"/>,
  watch: <><rect x="6" y="6" width="12" height="12" rx="4"/><path d="m8 6 1-5h6l1 5m-8 12 1 5h6l1-5m-4-9v3l2 1"/></>,
  home: <><path d="m3 10 9-8 9 8v11H3V10Z"/><path d="M9 21v-8h6v8"/></>,
  game: <><path d="M7 7h10c3 0 4 4 4 8s-2 5-4 2l-2-2H9l-2 2c-2 3-4 2-4-2S4 7 7 7Z"/><path d="M7 10v4m-2-2h4m7-1h.01m2 2h.01"/></>,
  pencil: <><path d="m15 3 6 6-11 11-7 1 1-7L15 3Zm-2 2 6 6M4 14l6 6"/></>,
  bike: <><circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 5-9 5 9H5m4-9h9l-2-5h3M7 5h5"/></>,
  tool: <path d="M21 3a6 6 0 0 1-8 8l-9 9a2 2 0 0 1-3-3l9-9a6 6 0 0 1 8-8l-4 4 3 3 4-4Z"/>,
  box: <><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10v10M3 7l9 5 9-5M7 5l9 5"/></>,
  pin: <><path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  shield: <><path d="m12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5l8-3Z"/><path d="m8 11 3 3 5-5"/></>,
  chat: <path d="M21 11a9 9 0 0 1-9 9 10 10 0 0 1-4-1l-6 2 2-6a10 10 0 0 1-1-4 9 9 0 0 1 18 0Z"/>,
  user: <><circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/></>,
  logout: <><path d="M9 3H3v18h6m5-14 5 5-5 5m-5-5h10"/></>,
  menu: <path d="M3 6h18M3 12h18M3 18h18"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  sliders: <><path d="M4 5h16M4 12h16M4 19h16"/><circle cx="8" cy="5" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="19" r="2"/></>,
  upload: <><path d="M12 16V3m-5 5 5-5 5 5M3 16v5h18v-5"/></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
  leaf: <><path d="M20 3C8 1 2 8 5 16s17 3 15-13ZM4 21 16 9"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
};
export default function Icon({ name, size = 20, className = "", ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...props}>{paths[name] || paths.bag}</svg>;
}
export const categoryIcons = { "Books & Notes": "book", Electronics: "laptop", Fashion: "shirt", Accessories: "watch", "Hostel & Room": "home", Gaming: "game", "Study Equipment": "pencil", Transport: "bike", Services: "tool", Other: "box" };
