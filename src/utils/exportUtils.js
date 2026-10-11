import * as XLSX from "xlsx";

/**
 * Cleanly format application objects into tabular export format
 */
export const formatApplicationsForExport = (applications = []) => {
  return applications.map((app) => ({
    "Application ID": app.id,
    "Company": app.company || "",
    "Position / Role": app.position || "",
    "Status": app.status || "WISHLIST",
    "Job Type": app.job_type || "REMOTE",
    "Location": app.location || "",
    "Expected Salary": app.expected_salary ? `$${Number(app.expected_salary).toLocaleString()}` : "",
    "Applied Date": app.applied_on || "",
    "Job Posting URL": app.job_link || app.job_url || "",
    "Notes": app.notes || "",
    "Created Date": app.created_at ? new Date(app.created_at).toLocaleString() : "",
  }));
};

/**
 * Triggers a browser file download using a Blob
 */
const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
};

/**
 * Export applications array to RFC 4180 CSV with UTF-8 BOM for Excel compatibility
 */
export const exportToCSV = (applications = [], filename = "jobtrail_applications.csv") => {
  if (!applications || applications.length === 0) {
    throw new Error("No applications available to export.");
  }

  const formattedData = formatApplicationsForExport(applications);
  const headers = Object.keys(formattedData[0]);

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value);
    if (/[",\n\r]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return `"${stringValue}"`;
  };

  const csvRows = [];
  csvRows.push(headers.map(escapeCSV).join(","));

  for (const row of formattedData) {
    const values = headers.map((header) => escapeCSV(row[header]));
    csvRows.push(values.join(","));
  }

  // Prepend UTF-8 BOM (\uFEFF) so Excel respects UTF-8 encoding
  const csvContent = "\uFEFF" + csvRows.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
  return true;
};

/**
 * Export applications array to native Microsoft Excel (.xlsx) file
 */
export const exportToExcel = (applications = [], filename = "jobtrail_applications.xlsx") => {
  if (!applications || applications.length === 0) {
    throw new Error("No applications available to export.");
  }

  const formattedData = formatApplicationsForExport(applications);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Set appropriate column widths for clean readability
  worksheet["!cols"] = [
    { wch: 14 }, // ID
    { wch: 22 }, // Company
    { wch: 26 }, // Position
    { wch: 14 }, // Status
    { wch: 12 }, // Job Type
    { wch: 18 }, // Location
    { wch: 16 }, // Expected Salary
    { wch: 14 }, // Applied Date
    { wch: 32 }, // Job URL
    { wch: 35 }, // Notes
    { wch: 20 }, // Created Date
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Job Applications");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  downloadBlob(blob, filename);
  return true;
};
