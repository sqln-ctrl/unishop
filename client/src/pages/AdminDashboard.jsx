import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

import {
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  getAdminProducts,
  deleteAdminProduct,
  getAdminReports,
  updateAdminReport,
  createAdmin,
  changeAdminPassword,
} from "../services/adminService.js";

const tabs = [
  "Overview",
  "Users",
  "Listings",
  "Reports",
  "Settings",
];

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-campus-navy/10 bg-white p-5">
    <p className="text-sm text-campus-navy/50">
      {label}
    </p>

    <p className="text-3xl font-bold mt-1">
      {value}
    </p>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] =
    useState("Overview");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
  });

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
    });

  const showError = (err) => {
    setError(
      err?.response?.data?.message ||
        "Something went wrong"
    );

    setMessage("");
  };

  const showMessage = (text) => {
    setMessage(text);
    setError("");
  };

  const loadStats = async () => {
    try {
      setStats(await getAdminStats());
    } catch (err) {
      showError(err);
    }
  };

  const loadUsers = async (value = search) => {
    try {
      setUsers(await getAdminUsers(value));
    } catch (err) {
      showError(err);
    }
  };

  const loadProducts = async () => {
    try {
      setProducts(await getAdminProducts());
    } catch (err) {
      showError(err);
    }
  };

  const loadReports = async () => {
    try {
      setReports(await getAdminReports());
    } catch (err) {
      showError(err);
    }
  };

  const loadDashboard = async () => {
    setLoading(true);

    try {
      await Promise.all([
        loadStats(),
        loadUsers(""),
        loadProducts(),
        loadReports(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleDeleteUser = async (target) => {
    if (
      !window.confirm(
        `Delete ${target.name}? This will also delete their listings.`
      )
    ) {
      return;
    }

    try {
      await deleteAdminUser(target._id);

      setUsers((current) =>
        current.filter(
          (item) => item._id !== target._id
        )
      );

      await loadStats();

      showMessage("User deleted successfully");
    } catch (err) {
      showError(err);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (
      !window.confirm(
        `Delete listing "${product.title}"?`
      )
    ) {
      return;
    }

    try {
      await deleteAdminProduct(product._id);

      setProducts((current) =>
        current.filter(
          (item) => item._id !== product._id
        )
      );

      await loadStats();

      showMessage("Listing deleted successfully");
    } catch (err) {
      showError(err);
    }
  };

  const handleReportStatus = async (
    reportId,
    status
  ) => {
    try {
      const updated = await updateAdminReport(
        reportId,
        status
      );

      setReports((current) =>
        current.map((report) =>
          report._id === reportId
            ? { ...report, ...updated }
            : report
        )
      );

      await loadStats();

      showMessage("Report updated");
    } catch (err) {
      showError(err);
    }
  };

  const handleCreateAdmin = async (event) => {
    event.preventDefault();

    try {
      await createAdmin(adminForm);

      setAdminForm({
        name: "",
        email: "",
        password: "",
        university: "",
      });

      await Promise.all([
        loadUsers(),
        loadStats(),
      ]);

      showMessage(
        "New admin created successfully"
      );
    } catch (err) {
      showError(err);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    try {
      await changeAdminPassword(passwordForm);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });

      showMessage(
        "Password changed successfully"
      );
    } catch (err) {
      showError(err);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await loadUsers(search);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-campus-navy/50">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="page-width admin-page">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-wider text-campus-gold font-semibold">
          Administration
        </p>

        <h1 className="text-3xl font-bold mt-1">
          Admin Dashboard
        </h1>

        <p className="text-campus-navy/60 mt-1">
          Welcome, {user?.name}.
        </p>
      </div>

      {(message || error) && (
        <div
          className={`mb-5 rounded-xl px-4 py-3 text-sm ${
            error
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto border-b border-campus-navy/10 mb-7">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeTab === tab
                ? "border-campus-gold text-campus-navy"
                : "border-transparent text-campus-navy/50 hover:text-campus-navy"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard
              label="Total users"
              value={stats?.users ?? 0}
            />

            <StatCard
              label="Admins"
              value={stats?.admins ?? 0}
            />

            <StatCard
              label="Active listings"
              value={stats?.listings ?? 0}
            />

            <StatCard
              label="Sold listings"
              value={stats?.soldListings ?? 0}
            />

            <StatCard
              label="Pending reports"
              value={stats?.pendingReports ?? 0}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-6">
            <div className="rounded-2xl border border-campus-navy/10 bg-white p-6">
              <h2 className="font-semibold text-lg">
                Platform management
              </h2>

              <p className="text-sm text-campus-navy/60 mt-2">
                Manage registered students, remove
                problematic listings, review reports,
                and control admin access.
              </p>
            </div>

            <div className="rounded-2xl border border-campus-navy/10 bg-white p-6">
              <h2 className="font-semibold text-lg">
                Security
              </h2>

              <p className="text-sm text-campus-navy/60 mt-2">
                Only accounts with server-side admin
                permission can access these management
                APIs.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Users" && (
        <div className="rounded-2xl border border-campus-navy/10 bg-white overflow-hidden">
          <div className="p-5 border-b border-campus-navy/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-lg">
                Registered users
              </h2>

              <p className="text-sm text-campus-navy/50">
                Delete users when necessary.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex gap-2"
            >
              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search users..."
                className="w-56 rounded-lg border border-campus-navy/15 px-3 py-2 text-sm outline-none focus:border-campus-gold"
              />

              <button className="rounded-lg bg-campus-navy text-campus-cream px-4 py-2 text-sm">
                Search
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-campus-navy/5 text-left">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">University</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-campus-navy/10"
                  >
                    <td className="p-4">
                      <div className="font-medium">
                        {item.name}
                      </div>

                      <div className="text-campus-navy/50">
                        {item.email}
                      </div>
                    </td>

                    <td className="p-4">
                      {item.university}
                    </td>

                    <td className="p-4">
                      {item.isAdmin
                        ? "Admin"
                        : item.accountType}
                    </td>

                    <td className="p-4">
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      {item._id === user?._id ? (
                        <span className="text-campus-navy/40">
                          Current account
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            handleDeleteUser(item)
                          }
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <p className="p-6 text-sm text-campus-navy/50">
              No users found.
            </p>
          )}
        </div>
      )}

      {activeTab === "Listings" && (
        <div className="rounded-2xl border border-campus-navy/10 bg-white overflow-hidden">
          <div className="p-5 border-b border-campus-navy/10">
            <h2 className="font-semibold text-lg">
              All listings
            </h2>

            <p className="text-sm text-campus-navy/50">
              Remove listings that violate marketplace
              rules.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-campus-navy/5 text-left">
                <tr>
                  <th className="p-4">Listing</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-campus-navy/10"
                  >
                    <td className="p-4">
                      <div className="font-medium">
                        {product.title}
                      </div>

                      <div className="text-campus-navy/50">
                        {product.category}
                      </div>
                    </td>

                    <td className="p-4">
                      {product.seller?.name ||
                        "Unknown"}
                    </td>

                    <td className="p-4">
                      ${product.price}
                    </td>

                    <td className="p-4 capitalize">
                      {product.status}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
                          handleDeleteProduct(product)
                        }
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <p className="p-6 text-sm text-campus-navy/50">
              No listings found.
            </p>
          )}
        </div>
      )}

      {activeTab === "Reports" && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="rounded-2xl border border-campus-navy/10 bg-white p-6 text-sm text-campus-navy/50">
              No reports found.
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report._id}
                className="rounded-2xl border border-campus-navy/10 bg-white p-5"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <h3 className="font-semibold">
                        {report.reason}
                      </h3>

                      <span className="text-xs rounded-full bg-campus-navy/5 px-2 py-1 capitalize">
                        {report.status}
                      </span>
                    </div>

                    <p className="text-sm mt-2">
                      Listing:{" "}
                      <span className="font-medium">
                        {report.product?.title ||
                          "Deleted listing"}
                      </span>
                    </p>

                    <p className="text-sm text-campus-navy/60 mt-1">
                      Reported by:{" "}
                      {report.reporter?.name ||
                        "Unknown"}{" "}
                      (
                      {report.reporter?.email || ""}
                      )
                    </p>

                    {report.description && (
                      <p className="text-sm text-campus-navy/70 mt-3">
                        {report.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() =>
                        handleReportStatus(
                          report._id,
                          "reviewed"
                        )
                      }
                      className="rounded-lg bg-campus-navy text-campus-cream px-3 py-2 text-xs"
                    >
                      Reviewed
                    </button>

                    <button
                      onClick={() =>
                        handleReportStatus(
                          report._id,
                          "dismissed"
                        )
                      }
                      className="rounded-lg border border-campus-navy/15 px-3 py-2 text-xs"
                    >
                      Dismiss
                    </button>

                    <button
                      onClick={() =>
                        handleReportStatus(
                          report._id,
                          "pending"
                        )
                      }
                      className="rounded-lg border border-campus-navy/15 px-3 py-2 text-xs"
                    >
                      Pending
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "Settings" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <form
            onSubmit={handleChangePassword}
            className="rounded-2xl border border-campus-navy/10 bg-white p-6"
          >
            <h2 className="font-semibold text-lg">
              Change password
            </h2>

            <p className="text-sm text-campus-navy/50 mt-1 mb-5">
              Change the password for your current admin
              account.
            </p>

            <div className="space-y-4">
              <input
                type="password"
                required
                placeholder="Current password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-campus-navy/15 px-3 py-2.5 text-sm outline-none focus:border-campus-gold"
              />

              <input
                type="password"
                required
                minLength={6}
                placeholder="New password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-campus-navy/15 px-3 py-2.5 text-sm outline-none focus:border-campus-gold"
              />

              <button className="rounded-lg bg-campus-navy text-campus-cream px-5 py-2.5 text-sm font-medium">
                Change password
              </button>
            </div>
          </form>

          <form
            onSubmit={handleCreateAdmin}
            className="rounded-2xl border border-campus-navy/10 bg-white p-6"
          >
            <h2 className="font-semibold text-lg">
              Add new admin
            </h2>

            <p className="text-sm text-campus-navy/50 mt-1 mb-5">
              Create another account that can access this
              dashboard.
            </p>

            <div className="space-y-4">
              <input
                required
                placeholder="Full name"
                value={adminForm.name}
                onChange={(e) =>
                  setAdminForm({
                    ...adminForm,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-campus-navy/15 px-3 py-2.5 text-sm outline-none focus:border-campus-gold"
              />

              <input
                required
                type="email"
                placeholder="Email"
                value={adminForm.email}
                onChange={(e) =>
                  setAdminForm({
                    ...adminForm,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-campus-navy/15 px-3 py-2.5 text-sm outline-none focus:border-campus-gold"
              />

              <input
                required
                minLength={6}
                type="password"
                placeholder="Password"
                value={adminForm.password}
                onChange={(e) =>
                  setAdminForm({
                    ...adminForm,
                    password: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-campus-navy/15 px-3 py-2.5 text-sm outline-none focus:border-campus-gold"
              />

              <input
                placeholder="University (optional)"
                value={adminForm.university}
                onChange={(e) =>
                  setAdminForm({
                    ...adminForm,
                    university: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-campus-navy/15 px-3 py-2.5 text-sm outline-none focus:border-campus-gold"
              />

              <button className="rounded-lg bg-campus-navy text-campus-cream px-5 py-2.5 text-sm font-medium">
                Create admin
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
