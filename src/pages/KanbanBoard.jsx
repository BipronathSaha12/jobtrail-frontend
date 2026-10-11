import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  listAllApplications,
  updateApplication,
  deleteApplication,
} from "../api/applications";
import KanbanColumn from "../components/KanbanColumn";
import KanbanCard from "../components/KanbanCard";
import ExportButton from "../components/ExportButton";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import {
  Plus,
  Search,
  List,
  Briefcase,
  Send,
  CalendarCheck,
  Award,
  XCircle,
  Kanban,
} from "lucide-react";

const COLUMNS = [
  { id: "WISHLIST", title: "Wishlist", icon: Briefcase, badgeClass: "col-wishlist" },
  { id: "APPLIED", title: "Applied", icon: Send, badgeClass: "col-applied" },
  { id: "INTERVIEW", title: "Interview", icon: CalendarCheck, badgeClass: "col-interview" },
  { id: "OFFER", title: "Offer", icon: Award, badgeClass: "col-offer" },
  { id: "REJECTED", title: "Rejected", icon: XCircle, badgeClass: "col-rejected" },
];

export default function KanbanBoard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [activeMobileColumn, setActiveMobileColumn] = useState("ALL"); // "ALL" or status key

  // DND State
  const [activeCard, setActiveCard] = useState(null);
  const [movingCardId, setMovingCardId] = useState(null);

  // Delete modal
  const [appToDelete, setAppToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Configure Sensors with touch-scroll friendly constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6, // 6px movement before drag begins
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms hold before touch drag, preserving normal page scroll
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const fetchBoardData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await listAllApplications();
      setApplications(res.results || []);
    } catch (err) {
      console.error("Failed to fetch applications for Kanban board:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, []);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        !search.trim() ||
        app.company?.toLowerCase().includes(search.toLowerCase().trim()) ||
        app.position?.toLowerCase().includes(search.toLowerCase().trim());
      const matchesType = !jobType || app.job_type === jobType;
      return matchesSearch && matchesType;
    });
  }, [applications, search, jobType]);

  // Grouped by column status
  const columnsData = useMemo(() => {
    const map = {
      WISHLIST: [],
      APPLIED: [],
      INTERVIEW: [],
      OFFER: [],
      REJECTED: [],
    };
    for (const app of filteredApps) {
      const st = app.status || "WISHLIST";
      if (map[st]) {
        map[st].push(app);
      } else {
        map.WISHLIST.push(app);
      }
    }
    return map;
  }, [filteredApps]);

  // Status update handler (used by both drag-and-drop & quick-move select)
  const handleUpdateStatus = async (appId, newStatus) => {
    if (!newStatus) return;

    // Snapshot for rollback
    const originalApps = [...applications];
    const targetApp = originalApps.find((a) => a.id === appId);
    if (!targetApp || targetApp.status === newStatus) return;

    // Optimistic UI update
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    setMovingCardId(appId);

    try {
      await updateApplication(appId, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update application status. Reverting changes.");
      setApplications(originalApps); // Rollback
    } finally {
      setMovingCardId(null);
    }
  };

  // DND Handlers
  const handleDragStart = (event) => {
    const { active } = event;
    const found = applications.find((a) => String(a.id) === String(active.id));
    setActiveCard(found || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = Number(active.id);
    let targetStatus = over.id;

    // If dropped over another card instead of directly on column
    if (over.data?.current?.status) {
      targetStatus = over.data.current.status;
    } else if (over.data?.current?.application) {
      targetStatus = over.data.current.application.status;
    }

    // Verify targetStatus is one of the valid statuses
    const validStatuses = ["WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
    if (validStatuses.includes(targetStatus)) {
      handleUpdateStatus(activeId, targetStatus);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!appToDelete) return;
    setIsDeleting(true);
    try {
      await deleteApplication(appToDelete.id);
      setApplications((prev) => prev.filter((a) => a.id !== appToDelete.id));
      setAppToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete application. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Loader message="Loading interactive Kanban board..." />;
  if (error) return <ErrorState message="Could not load Kanban board data." onRetry={fetchBoardData} />;

  return (
    <div className="kanban-page">
      {/* Top Header */}
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="brand-icon" style={{ width: 34, height: 34, padding: 0 }}>
              <Kanban size={20} />
            </div>
            <h1 className="page-title">Application Pipeline Kanban</h1>
          </div>
          <p className="page-subtitle">
            Drag and drop applications across hiring stages to update status in real time
          </p>
        </div>

        <div className="page-header-actions">
          <ExportButton applications={filteredApps} label="Export Pipeline" />
          <Link to="/applications" className="btn btn-secondary">
            <List size={18} />
            <span className="btn-text-responsive">List View</span>
          </Link>
          <Link to="/applications/new" className="btn btn-primary">
            <Plus size={18} />
            <span className="btn-text-responsive">New Application</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar kanban-filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" aria-hidden="true" />
          <input
            type="text"
            className="search-input"
            placeholder="Search company or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search company or position in Kanban board"
          />
        </div>

        <select
          className="select-input"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          aria-label="Filter by job type"
        >
          <option value="">All Job Types</option>
          <option value="ONSITE">Onsite</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
        </select>

        <div className="kanban-total-badge">
          <span>{filteredApps.length}</span> Total Tracked
        </div>
      </div>

      {/* Mobile Column Navigation Tabs (visible only on small mobile view <= 650px) */}
      <div className="kanban-mobile-tabs" role="tablist" aria-label="Kanban Columns">
        <button
          type="button"
          className={`mobile-tab-btn ${activeMobileColumn === "ALL" ? "active" : ""}`}
          onClick={() => setActiveMobileColumn("ALL")}
          role="tab"
          aria-selected={activeMobileColumn === "ALL"}
        >
          All Columns
        </button>
        {COLUMNS.map((col) => {
          const count = columnsData[col.id]?.length || 0;
          return (
            <button
              key={col.id}
              type="button"
              className={`mobile-tab-btn ${activeMobileColumn === col.id ? "active" : ""}`}
              onClick={() => setActiveMobileColumn(col.id)}
              role="tab"
              aria-selected={activeMobileColumn === col.id}
            >
              {col.title} ({count})
            </button>
          );
        })}
      </div>

      {/* DND Kanban Columns Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className={`kanban-board-container ${
            activeMobileColumn !== "ALL" ? "mobile-single-column-active" : ""
          }`}
        >
          {COLUMNS.map((col) => {
            const isHiddenOnMobile =
              activeMobileColumn !== "ALL" && activeMobileColumn !== col.id;
            return (
              <div
                key={col.id}
                className={`kanban-column-wrapper ${isHiddenOnMobile ? "mobile-hidden" : ""}`}
              >
                <KanbanColumn
                  id={col.id}
                  title={col.title}
                  icon={col.icon}
                  badgeClass={col.badgeClass}
                  applications={columnsData[col.id] || []}
                  onDelete={(app) => setAppToDelete(app)}
                  onQuickMove={(app, newSt) => handleUpdateStatus(app.id, newSt)}
                  movingCardId={movingCardId}
                />
              </div>
            );
          })}
        </div>

        {/* Drag Overlay Ghost Card */}
        <DragOverlay dropAnimation={null}>
          {activeCard ? (
            <KanbanCard application={activeCard} isDragOverlay={true} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(appToDelete)}
        title={appToDelete ? `Delete ${appToDelete.position} at ${appToDelete.company}?` : ""}
        message="This action cannot be undone. This application will be permanently removed from your pipeline."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setAppToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
