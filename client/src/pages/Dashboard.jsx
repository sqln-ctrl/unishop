import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserListings } from "../services/productService.js";
import ProductCard from "../components/ProductCard.jsx";

const Dashboard = () => {
  const { user, switchAccountType } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);

  const isSeller = user?.accountType === "seller";

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getUserListings(user._id);
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user && isSeller) fetch();
    else setLoading(false);
  }, [user, isSeller]);

  const active = listings.filter((l) => l.status === "available");
  const sold = listings.filter((l) => l.status === "sold");

  const handleSwitch = async (accountType) => {
    setSwitching(true);
    try {
      await switchAccountType(accountType);
    } catch (err) {
      console.error(err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hi, {user?.name?.split(" ")[0]}</h1>
          <p className="text-campus-navy/60 mt-1">
            {user?.university} ·{" "}
            <span className="capitalize">{user?.accountType} account</span>
          </p>
        </div>
        {isSeller ? (
          <Link
            to="/create"
            className="rounded-full bg-campus-navy text-campus-cream px-5 py-2.5 text-sm font-medium"
          >
            + New listing
          </Link>
        ) : (
          <button
            onClick={() => handleSwitch("seller")}
            disabled={switching}
            className="rounded-full bg-campus-navy text-campus-cream px-5 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {switching ? "Switching..." : "Become a seller"}
          </button>
        )}
      </div>

      {!isSeller ? (
        <div className="rounded-2xl border border-campus-navy/10 bg-white p-8 text-center">
          <h2 className="font-display text-lg font-semibold">
            You're on a regular account
          </h2>
          <p className="text-campus-navy/60 text-sm mt-1 max-w-sm mx-auto">
            Regular accounts can browse and message sellers. Switch to a seller account
            to start listing your own items.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-3">Active listings ({active.length})</h2>
          {loading ? (
            <p className="text-campus-navy/50 text-sm mb-8">Loading...</p>
          ) : active.length === 0 ? (
            <p className="text-campus-navy/50 text-sm mb-8">
              You haven't listed anything yet.{" "}
              <Link to="/create" className="text-campus-gold font-medium">
                Create your first listing
              </Link>
              .
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
              {active.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {sold.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-3">Sold ({sold.length})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                {sold.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </>
          )}

          <button
            onClick={() => handleSwitch("regular")}
            disabled={switching}
            className="text-sm text-campus-navy/50 hover:text-campus-navy underline disabled:opacity-50"
          >
            Switch back to a regular account
          </button>
        </>
      )}
    </div>
  );
};

export default Dashboard;
