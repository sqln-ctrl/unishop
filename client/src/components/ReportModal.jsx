import React, { useState } from "react";
import { createReport } from "../services/reportService.js";

const REASONS = [
  "Prohibited item",
  "Misleading listing",
  "Suspected scam",
  "Inappropriate content",
  "Spam",
  "Other",
];

const ReportModal = ({ productId, onClose }) => {
  const [reason, setReason] = useState(REASONS[0]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createReport({ productId, reason, description });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-campus-navy/40 px-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
        {submitted ? (
          <>
            <h2 className="font-display text-lg font-semibold">Report submitted</h2>
            <p className="text-sm text-campus-navy/60 mt-2">
              Thanks — our team will review this listing shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-full bg-campus-navy text-campus-cream py-2 text-sm font-medium"
            >
              Close
            </button>
          </>
        ) : (
          <>
            <h2 className="font-display text-lg font-semibold">Report this listing</h2>
            <p className="text-sm text-campus-navy/60 mt-1 mb-4">
              Let us know what's wrong — reports are reviewed by admins, not the seller.
            </p>

            {error && (
              <div className="mb-3 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 text-sm"
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Details (optional)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-campus-navy/20 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full border border-campus-navy/20 py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-full bg-campus-navy text-campus-cream py-2 text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Submit report"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportModal;