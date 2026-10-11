import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStats, listApplications, deleteApplication } from "../api/applications";
import StatCard from "../components/StatCard";
import ApplicationCard from "../components/ApplicationCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, ArrowRight, Layers, Send, CalendarCheck, Award, XCircle, Briefcase } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Modal state for delete
  const [appToDelete, setAppToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [statsData, appsData] = await Promise.all([
        getStats(),
        listApplications({ ordering: "-created_at" }),
      ]);
      setStats(statsData);
      // Take only the top 5 recent applications
      setRecentApps(appsData.results ? appsData.results.slice(0, 5) : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!appToDelete) return;
    setIsDeleting(true);
    try {
      await deleteApplication(appToDelete.id);
      setAppToDelete(null);
      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to delete application:", err);
      alert("Could not delete application. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async (updatedApp) => {
    setRecentApps((prev) =>
      prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
    );
    try {
      const statsData = await getStats();
      setStats(statsData);
    } catch (e) {
      console.error("Failed to refresh stats:", e);
    }
  };

  if (loading) return <Loader message="Loading dashboard statistics..." />;
  if (error) return <ErrorState message="Could not load your dashboard stats." onRetry={fetchDashboardData} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Job Application Dashboard</h1>
          <p className="page-subtitle">Track your application pipeline metrics and recent activity</p>
        </div>
        <Link to="/applications/new" className="btn btn-primary">
          <Plus size={18} />
          <span>Add Application</span>
        </Link>
      </div>

      {/* 5 Dynamic Stat Cards */}
      <div className="stats-grid">
        <StatCard title="Total" count={stats?.total} icon={Layers} badgeClass="badge-WISHLIST" />
        <StatCard title="Wishlist" count={stats?.wishlist} icon={Briefcase} badgeClass="badge-WISHLIST" />
        <StatCard title="Applied" count={stats?.applied} icon={Send} badgeClass="badge-APPLIED" />
        <StatCard title="Interview" count={stats?.interview} icon={CalendarCheck} badgeClass="badge-INTERVIEW" />
        <StatCard title="Offer" count={stats?.offer} icon={Award} badgeClass="badge-OFFER" />
        <StatCard title="Rejected" count={stats?.rejected} icon={XCircle} badgeClass="badge-REJECTED" />
      </div>

      {/* Recent Applications Section */}
      <div style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700 }}>Recent Applications</h2>
          {recentApps.length > 0 && (
            <Link to="/applications" style={{ color: "#a5b4fc", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none" }}>
              <span>See all</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {recentApps.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="applications-list">
            {recentApps.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onDelete={(appToDel) => setAppToDelete(appToDel)}
                onStatusChange={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(appToDelete)}
        title={appToDelete ? `Delete ${appToDelete.position} at ${appToDelete.company}?` : ""}
        message="This action cannot be undone. This application will be permanently removed."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setAppToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
