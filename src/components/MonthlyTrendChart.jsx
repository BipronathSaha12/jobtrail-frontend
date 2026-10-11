import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp, BarChart3, Calendar } from "lucide-react";

// Custom glassmorphic tooltip for dark theme
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    return (
      <div className="custom-chart-tooltip">
        <div className="tooltip-header">
          <Calendar size={14} className="tooltip-icon" />
          <span className="tooltip-label">{label}</span>
        </div>
        <div className="tooltip-items">
          {payload.map((item, idx) => (
            <div key={`tip-${idx}`} className="tooltip-row">
              <span className="tooltip-dot" style={{ backgroundColor: item.color }} />
              <span className="tooltip-name">{item.name}:</span>
              <span className="tooltip-value">{item.value}</span>
            </div>
          ))}
          {payload.length > 1 && (
            <div className="tooltip-total-row">
              <span>Total:</span>
              <span className="tooltip-total-val">{total}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function MonthlyTrendChart({ trends = [], stats = null }) {
  const [chartType, setChartType] = useState("area"); // "area" | "bar"

  // Process and format data
  const data = useMemo(() => {
    if (trends && trends.length > 0) {
      return trends.map((item) => ({
        month: item.month,
        Total: item.total ?? (
          (item.wishlist || 0) +
          (item.applied || 0) +
          (item.interview || 0) +
          (item.offer || 0) +
          (item.rejected || 0)
        ),
        Wishlist: item.wishlist || 0,
        Applied: item.applied || 0,
        Interview: item.interview || 0,
        Offer: item.offer || 0,
        Rejected: item.rejected || 0,
      }));
    }
    return [];
  }, [trends]);

  // Derive summary metrics
  const { topMonth, totalApplications, interviewCount, offerCount } = useMemo(() => {
    let peak = { month: "N/A", total: 0 };
    let sum = 0;
    for (const d of data) {
      sum += d.Total;
      if (d.Total > peak.total) {
        peak = { month: d.month, total: d.Total };
      }
    }
    return {
      topMonth: peak.month,
      totalApplications: stats?.total ?? sum,
      interviewCount: stats?.interview ?? 0,
      offerCount: stats?.offer ?? 0,
    };
  }, [data, stats]);

  if (!data || data.length === 0) {
    return (
      <div className="chart-card empty-chart">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Monthly Application Trends</h3>
            <p className="chart-subtitle">Add application dates to view monthly velocity and trends</p>
          </div>
        </div>
        <div className="chart-placeholder">
          <Calendar size={36} className="text-muted" />
          <p>Not enough chronological data yet to plot trends.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title-area">
          <div className="chart-icon-badge">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="chart-title">Monthly Application Trends</h3>
            <p className="chart-subtitle">Application activity and pipeline velocity over time</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="chart-controls">
          <button
            type="button"
            className={`chart-toggle-btn ${chartType === "area" ? "active" : ""}`}
            onClick={() => setChartType("area")}
            title="Area Trend View"
          >
            <TrendingUp size={15} />
            <span className="btn-text-responsive">Trend Area</span>
          </button>
          <button
            type="button"
            className={`chart-toggle-btn ${chartType === "bar" ? "active" : ""}`}
            onClick={() => setChartType("bar")}
            title="Status Breakdown View"
          >
            <BarChart3 size={15} />
            <span className="btn-text-responsive">Status Breakdown</span>
          </button>
        </div>
      </div>

      {/* Mini KPI Highlights */}
      <div className="chart-kpis">
        <div className="chart-kpi">
          <span className="kpi-label">Peak Month</span>
          <span className="kpi-val text-accent">{topMonth}</span>
        </div>
        <div className="chart-kpi">
          <span className="kpi-label">Tracked Total</span>
          <span className="kpi-val">{totalApplications}</span>
        </div>
        <div className="chart-kpi">
          <span className="kpi-label">Interviews</span>
          <span className="kpi-val text-interview">{interviewCount}</span>
        </div>
        <div className="chart-kpi">
          <span className="kpi-label">Offers Won</span>
          <span className="kpi-val text-offer">{offerCount}</span>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="chart-body">
        <ResponsiveContainer width="100%" height={280}>
          {chartType === "area" ? (
            <AreaChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "12px", fontSize: "12px", color: "#cbd5e1" }}
              />
              <Area
                type="monotone"
                dataKey="Total"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="Applied"
                stroke="#60a5fa"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorApplied)"
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "12px", fontSize: "12px", color: "#cbd5e1" }}
              />
              <Bar dataKey="Wishlist" stackId="a" fill="#94a3b8" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Applied" stackId="a" fill="#60a5fa" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Interview" stackId="a" fill="#c084fc" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Offer" stackId="a" fill="#4ade80" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Rejected" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
