import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    accountType: "regular",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-1">Join UniShop</h1>
      <p className="text-campus-navy/60 mb-6 text-sm">
        Buy, sell, and trade with students at your university.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Account type</label>
          <div className="mt-1 grid grid-cols-2 gap-3">
            {[
              { value: "regular", label: "Regular", hint: "Browse & buy" },
              { value: "seller", label: "Seller", hint: "List & sell items" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors ${
                  form.accountType === opt.value
                    ? "border-campus-gold bg-campus-gold/10"
                    : "border-campus-navy/20"
                }`}
              >
                <input
                  type="radio"
                  name="accountType"
                  value={opt.value}
                  checked={form.accountType === opt.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="font-medium block">{opt.label}</span>
                <span className="text-xs text-campus-navy/50">{opt.hint}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-campus-navy/40 mt-1">
            You can switch this later from your dashboard.
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
        </div>
        <div>
          <label className="text-sm font-medium">University</label>
          <input
            name="university"
            required
            value={form.university}
            onChange={handleChange}
            placeholder="e.g. LUMS, FAST, UCP"
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
        </div>
        <div>
          <label className="text-sm font-medium">University email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-campus-gold"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-campus-navy text-campus-cream py-2.5 font-medium hover:bg-campus-navy/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-campus-navy/60 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-campus-gold font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
