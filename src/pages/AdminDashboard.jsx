import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, BookOpen, AlertOctagon, DollarSign, Ban, CheckCircle, Trash, Star, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // State data variables
  const [stats, setStats] = useState({ totalUsers: 0, totalRecipes: 0, totalPremium: 0, totalReports: 0 });
  const [usersList, setUsersList] = useState([]);
  const [recipesList, setRecipesList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);

  // Load state helpers
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTab, setLoadingTab] = useState(false);

  const fetchOverviewStats = async () => {
    setLoadingStats(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/overview`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingTab(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/users`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTab(false);
    }
  };

  const fetchRecipes = async () => {
    setLoadingTab(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/recipes`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setRecipesList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTab(false);
    }
  };

  const fetchReports = async () => {
    setLoadingTab(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/reports`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setReportsList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTab(false);
    }
  };

  const fetchTransactions = async () => {
    setLoadingTab(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/transactions`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setTransactionsList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTab(false);
    }
  };

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "recipes") fetchRecipes();
    if (activeTab === "reports") fetchReports();
    if (activeTab === "transactions") fetchTransactions();
    if (activeTab === "overview") fetchOverviewStats();
  }, [activeTab]);

  // Actions
  const handleBlockUser = async (id, block) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const endpoint = block ? "block" : "unblock";
      const res = await fetch(`${apiUrl}/api/admin/users/${id}/${endpoint}`, {
        method: "PUT",
        credentials: "include"
      });
      if (res.ok) {
        toast.success(`User ${block ? 'blocked' : 'unblocked'} successfully.`, { className: "toast-custom" });
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message, { className: "toast-custom" });
    }
  };

  const handleToggleFeature = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/recipes/${id}/feature`, {
        method: "PUT",
        credentials: "include"
      });
      if (res.ok) {
        toast.success("Featured status updated.", { className: "toast-custom" });
        fetchRecipes();
      }
    } catch (err) {
      toast.error(err.message, { className: "toast-custom" });
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe permanently?")) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/recipes/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        toast.success("Recipe deleted from catalog.", { className: "toast-custom" });
        fetchRecipes();
      }
    } catch (err) {
      toast.error(err.message, { className: "toast-custom" });
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/reports/${reportId}/dismiss`, {
        method: "PUT",
        credentials: "include"
      });
      if (res.ok) {
        toast.success("Report dismissed successfully", { className: "toast-custom" });
        fetchReports();
        fetchOverviewStats();
      }
    } catch (err) {
      toast.error(err.message, { className: "toast-custom" });
    }
  };

  const handleTakeDownRecipe = async (reportId) => {
    if (!window.confirm("This will delete the recipe and resolve the report. Proceed?")) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/reports/${reportId}/remove-recipe`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        toast.success("Recipe deleted and report resolved.", { className: "toast-custom" });
        fetchReports();
        fetchOverviewStats();
      }
    } catch (err) {
      toast.error(err.message, { className: "toast-custom" });
    }
  };

  return (
    <div className="container section-padding" style={{ paddingTop: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>Admin Panel</h1>
          <p style={{ color: "var(--text-secondary)" }}>RecipeHub administrative moderation and transactional dashboard.</p>
        </div>
        <button onClick={fetchOverviewStats} className="btn btn-secondary btn-sm" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="dashboard-layout">
        {/* Sidebar tabs */}
        <aside className="dashboard-sidebar">
          <div onClick={() => setActiveTab("overview")} className={`sidebar-tab ${activeTab === "overview" ? "active" : ""}`}>
            <CheckCircle size={18} />
            <span>Overview</span>
          </div>

          <div onClick={() => setActiveTab("users")} className={`sidebar-tab ${activeTab === "users" ? "active" : ""}`}>
            <Users size={18} />
            <span>Manage Users</span>
          </div>

          <div onClick={() => setActiveTab("recipes")} className={`sidebar-tab ${activeTab === "recipes" ? "active" : ""}`}>
            <BookOpen size={18} />
            <span>Manage Recipes</span>
          </div>

          <div onClick={() => setActiveTab("reports")} className={`sidebar-tab ${activeTab === "reports" ? "active" : ""}`}>
            <AlertOctagon size={18} />
            <span>Report Center ({stats.totalReports})</span>
          </div>

          <div onClick={() => setActiveTab("transactions")} className={`sidebar-tab ${activeTab === "transactions" ? "active" : ""}`}>
            <DollarSign size={18} />
            <span>Transactions Log</span>
          </div>
        </aside>

        {/* Tab display contents */}
        <main style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px", border: "1px solid #E5DEC9", overflowX: "auto" }}>
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div>
              <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>System Metrics Overview</h2>
              {loadingStats ? (
                <p>Loading stats...</p>
              ) : (
                <div className="stats-grid">
                  <div className="stat-card">
                    <span style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: "600" }}>Total Users</span>
                    <span className="stat-val">{stats.totalUsers}</span>
                  </div>
                  <div className="stat-card">
                    <span style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: "600" }}>Recipes Hosted</span>
                    <span className="stat-val">{stats.totalRecipes}</span>
                  </div>
                  <div className="stat-card">
                    <span style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: "600" }}>Premium Members</span>
                    <span className="stat-val">{stats.totalPremium}</span>
                  </div>
                  <div className="stat-card" style={{ border: stats.totalReports > 0 ? "1px solid #DC2626" : "1px solid var(--border)" }}>
                    <span style={{ color: stats.totalReports > 0 ? "#DC2626" : "var(--text-secondary)", fontSize: "14px", fontWeight: "600" }}>Pending Reports</span>
                    <span className="stat-val" style={{ color: stats.totalReports > 0 ? "#DC2626" : "var(--primary)" }}>{stats.totalReports}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MANAGE USERS TAB */}
          {activeTab === "users" && (
            <div>
              <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>User Accounts</h2>
              {loadingTab ? (
                <p>Loading users list...</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Premium</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u._id}>
                          <td style={{ fontWeight: 600 }}>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span style={{ textTransform: "capitalize" }}>{u.role}</span>
                          </td>
                          <td>
                            {u.isBlocked ? (
                              <span style={{ color: "#DC2626", fontWeight: "bold" }}>Blocked</span>
                            ) : (
                              <span style={{ color: "var(--primary)", fontWeight: "600" }}>Active</span>
                            )}
                          </td>
                          <td>
                            {u.isPremium ? (
                              <span style={{ color: "#D97706", fontWeight: "600" }}>Premium</span>
                            ) : (
                              <span style={{ color: "var(--text-muted)" }}>No</span>
                            )}
                          </td>
                          <td>
                            {u.role === "admin" ? (
                              <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Protected</span>
                            ) : u.isBlocked ? (
                              <button onClick={() => handleBlockUser(u._id, false)} className="btn btn-secondary btn-sm" style={{ color: "var(--primary)" }}>
                                Unblock
                              </button>
                            ) : (
                              <button onClick={() => handleBlockUser(u._id, true)} className="btn btn-secondary btn-sm" style={{ color: "#DC2626" }}>
                                <Ban size={14} style={{ marginRight: "4px" }} /> Block
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* MANAGE RECIPES TAB */}
          {activeTab === "recipes" && (
            <div>
              <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>Global Recipes Catalog</h2>
              {loadingTab ? (
                <p>Loading recipes list...</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Cuisine</th>
                        <th>Price</th>
                        <th>Likes</th>
                        <th>Featured</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipesList.map((r) => (
                        <tr key={r._id}>
                          <td style={{ fontWeight: 600 }}>
                            <Link to={`/recipes/${r._id}`} style={{ color: "var(--primary)", textDecoration: "underline" }}>
                              {r.recipeName}
                            </Link>
                          </td>
                          <td>{r.authorEmail}</td>
                          <td>{r.cuisineType}</td>
                          <td style={{ fontWeight: 600 }}>{r.price > 0 ? `$${r.price.toFixed(2)}` : "Free"}</td>
                          <td>{r.likesCount}</td>
                          <td>
                            <button onClick={() => handleToggleFeature(r._id)} className="btn btn-secondary btn-sm" style={{ padding: "4px 8px" }}>
                              <Star size={14} fill={r.isFeatured ? "#EAB308" : "none"} color={r.isFeatured ? "#EAB308" : "currentColor"} />
                            </button>
                          </td>
                          <td>
                            <button onClick={() => handleDeleteRecipe(r._id)} className="btn btn-secondary btn-sm" style={{ color: "#DC2626" }}>
                              <Trash size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* REPORT CENTER TAB */}
          {activeTab === "reports" && (
            <div>
              <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>Pending Flagged Content Reports</h2>
              {loadingTab ? (
                <p>Loading reports...</p>
              ) : reportsList.length === 0 ? (
                <p style={{ color: "var(--text-secondary)" }}>All clear! There are no pending reports.</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Recipe ID</th>
                        <th>Reporter</th>
                        <th>Violation Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportsList.map((rep) => (
                        <tr key={rep._id}>
                          <td>
                            {rep.recipeId ? (
                              <Link to={`/recipes/${rep.recipeId._id}`} style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: 600 }}>
                                {rep.recipeId.recipeName}
                              </Link>
                            ) : (
                              <span style={{ color: "var(--text-muted)" }}>Recipe Deleted</span>
                            )}
                          </td>
                          <td>{rep.reporterEmail}</td>
                          <td style={{ color: "#DC2626", fontWeight: "600" }}>{rep.reason}</td>
                          <td style={{ textTransform: "capitalize" }}>{rep.status}</td>
                          <td>
                            {rep.status === "pending" && rep.recipeId ? (
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => handleDismissReport(rep._id)} className="btn btn-secondary btn-sm" style={{ color: "var(--primary)" }}>
                                  Dismiss
                                </button>
                                <button onClick={() => handleTakeDownRecipe(rep._id)} className="btn btn-danger btn-sm">
                                  Take Down
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: "var(--text-muted)" }}>Resolved</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === "transactions" && (
            <div>
              <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>Revenue & Transactions log</h2>
              {loadingTab ? (
                <p>Loading transactions...</p>
              ) : transactionsList.length === 0 ? (
                <p style={{ color: "var(--text-secondary)" }}>No transaction records found.</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>User Email</th>
                        <th>Type</th>
                        <th>Target ID</th>
                        <th>Amount</th>
                        <th>Transaction ID</th>
                        <th>Paid At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionsList.map((t) => (
                        <tr key={t._id}>
                          <td>{t.userEmail}</td>
                          <td>
                            {t.isMembership ? (
                              <span style={{ color: "#D97706", fontWeight: "bold" }}>Premium Membership</span>
                            ) : (
                              <span>Recipe Purchase</span>
                            )}
                          </td>
                          <td>{t.recipeId ? t.recipeId : "N/A"}</td>
                          <td style={{ fontWeight: 700, color: "var(--primary)" }}>${t.amount.toFixed(2)}</td>
                          <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{t.transactionId}</td>
                          <td>{new Date(t.paidAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
