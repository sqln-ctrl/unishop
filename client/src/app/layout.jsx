import "../index.css";
import Providers from "./providers.jsx";
import AppShell from "./app-shell.jsx";

export const metadata = {
  title: "UniShop — Campus Marketplace",
  description: "Buy and sell textbooks, electronics, and everyday essentials with your campus community.",
};

export const viewport = { themeColor: "#2864e9" };

export default function RootLayout({ children }) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" /></head><body><Providers><AppShell>{children}</AppShell></Providers></body></html>;
}
