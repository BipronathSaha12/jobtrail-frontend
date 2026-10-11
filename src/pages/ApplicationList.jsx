import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listApplications, deleteApplication } from "../api/applications";
import ApplicationCard from "../components/ApplicationCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ConfirmModal from "../components/ConfirmModal";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function ApplicationList() {
  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [jobType, setJobType] = useState("");
  const [page, setPage] = useState(1);

  // Delete modal state
  const [appToDelete, setAppToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplications = () => {
    let ignore = false;
    setLoading(true);
    setError(false);

    const params = { page };
    if (search.trim()) params.search = search.trim();
    if (status) params.status = status;
    if (jobType) params.job_type = jobType;

    listApplications(params)
      .then((res) => {
        if (!ignore) setData(res);
      })
      .catch((err) => {
        if (!ignore) {
          // If page out of range 404, reset to page 1
          if (err.response?.status === 404 && page > 1) {
            setPage(1);
          } else {
            setError(true);
          }
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  };

  useEffect(() => {
    const cancel = fetchApplications();
    return cancel;
  }, [search, status, jobType, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on filter/search change
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1); // Reset to page 1 on filter/search change
  };

  const handleJobTypeChange = (e) => {
    setJobType(e.target.value);
    setPage(1); // Reset to page 1 on filter/search change
  };

  const handleDeleteConfirm = async () => {
    if (!appToDelete) return;
    setIsDeleting(true);
    try {
      await deleteApplication(appToDelete.id);
      setAppToDelete(null);

      // Check if deleted item was the last item on current page (>1)
      if (data.results.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchApplications();
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete application. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = (updatedApp) => {
    setData((prev) => ({
      ...prev,
      results: prev.results.map((item) => (item.id === updatedApp.id ? updatedApp : item)),
    }));
  };

  const totalPages = Math.ceil((data.count || 0) / 10);
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (page <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (page >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }
    return pages;
  };

  const isFiltered = Boolean(search.trim() || status || jobType);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Applications</h1>
          <p className="page-subtitle">Manage, filter, and track your job applications</p>
        </div>
        <Link to="/applications/new" className="btn btn-primary">
          <Plus size={18} />
          <span>Add Application</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" aria-hidden="true" />
          <input
            type="text"
            className="search-input"
            placeholder="Search company or position..."
            value={search}
            onChange={handleSearchChange}
            aria-label="Search company or position"
          />
        </div>

        <select className="select-input" value={status} onChange={handleStatusChange} aria-label="Filter by application status">
          <option value="">All Statuses</option>
          <option value="WISHLIST">Wishlist</option>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select className="select-input" value={jobType} onChange={handleJobTypeChange} aria-label="Filter by job type">
          <option value="">All Job Types</option>
          <option value="ONSITE">Onsite</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
        </select>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <Loader message="Fetching applications list..." />
      ) : error ? (
        <ErrorState onRetry={fetchApplications} />
      ) : data.results.length === 0 ? (
        <EmptyState isFiltered={isFiltered} />
      ) : (
        <>
          <div className="applications-list">
            {data.results.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onDelete={(targetApp) => setAppToDelete(targetApp)}
                onStatusChange={handleStatusUpdate}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {data.results.length} of {data.count} applications (Page {page} of {totalPages})
              </div>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
                {getPageNumbers().map((pageNum, idx) =>
                  pageNum === "..." ? (
                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis" style={{ padding: "0 0.35rem", color: "var(--text-muted)", userSelect: "none" }}>
                      …
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      className={`page-btn ${pageNum === page ? "active" : ""}`}
                      onClick={() => setPage(pageNum)}
                      aria-label={`Page ${pageNum}`}
                      aria-current={pageNum === page ? "page" : undefined}
                    >
                      {pageNum}
                    </button>
                  )
                )}
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(appToDelete)}
        title={appToDelete ? `Delete ${appToDelete.position} at ${appToDelete.company}?` : ""}
        message="This will permanently delete this record from your job application tracker."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setAppToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
