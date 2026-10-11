import React, { useState, useRef, useEffect } from "react";
import { Download, FileSpreadsheet, FileText, ChevronDown, Loader2 } from "lucide-react";
import { exportToCSV, exportToExcel } from "../utils/exportUtils";

export default function ExportButton({ applications = null, onFetchAll = null, label = "Export" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getExportData = async () => {
    if (applications && applications.length > 0) {
      return applications;
    }
    if (onFetchAll) {
      return await onFetchAll();
    }
    return [];
  };

  const handleExport = async (format) => {
    setIsOpen(false);
    setIsExporting(true);
    try {
      const data = await getExportData();
      if (!data || data.length === 0) {
        alert("No applications found to export.");
        return;
      }

      const dateStr = new Date().toISOString().split("T")[0];
      if (format === "csv") {
        exportToCSV(data, `jobtrail_applications_${dateStr}.csv`);
      } else if (format === "excel") {
        exportToExcel(data, `jobtrail_applications_${dateStr}.xlsx`);
      }
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export applications: " + (err.message || "Unknown error"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-secondary export-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isExporting}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {isExporting ? (
          <Loader2 size={16} className="spin-icon" />
        ) : (
          <Download size={16} />
        )}
        <span>{isExporting ? "Exporting..." : label}</span>
        <ChevronDown size={14} className={`dropdown-chevron ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="export-dropdown-menu" role="menu">
          <button
            type="button"
            className="export-menu-item"
            onClick={() => handleExport("csv")}
            role="menuitem"
          >
            <div className="export-item-icon csv-icon">
              <FileText size={16} />
            </div>
            <div className="export-item-text">
              <span className="export-item-title">Export CSV</span>
              <span className="export-item-desc">Comma-separated values (.csv)</span>
            </div>
          </button>

          <button
            type="button"
            className="export-menu-item"
            onClick={() => handleExport("excel")}
            role="menuitem"
          >
            <div className="export-item-icon excel-icon">
              <FileSpreadsheet size={16} />
            </div>
            <div className="export-item-text">
              <span className="export-item-title">Export Excel</span>
              <span className="export-item-desc">Microsoft Excel Workbook (.xlsx)</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
