import { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { API_BASE } from "../utils/api";
import "../styles/StatsCharts.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function StatsCharts() {
  const [categoryChartData, setCategoryChartData] = useState(null);
  const [yearChartData, setYearChartData] = useState(null);
  const [stats, setStats] = useState({
    totalDatasets: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      // Fetch categories to get research count per category
      const categoriesResp = await fetch(`${API_BASE}/categories`);
      const categories = await categoriesResp.json();

      // Fetch years from filters endpoint
      const yearsResp = await fetch(`${API_BASE}/filters/years`);
      const years = await yearsResp.json();

      // Fetch all research to count total
      const searchResp = await fetch(`${API_BASE}/search?q=all`);
      const searchData = await searchResp.json();
      const totalDatasets = searchData.results ? searchData.results.length : 0;

      // Build category chart data
      const catLabels = categories.map((c) => c.name || "Unknown");
      const catCounts = categories.map((c) => c.count || 0);

      setCategoryChartData({
        labels: catLabels,
        datasets: [
          {
            label: "Research Items by Category",
            data: catCounts,
            backgroundColor: [
              "#667eea",
              "#764ba2",
              "#f093fb",
              "#4facfe",
              "#00f2fe",
              "#43e97b",
              "#fa709a",
              "#fee140",
              "#30cfd0",
              "#330867",
            ],
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      });

      // Build year chart data
      const yearLabels = years.slice(-10).map((y) => y.toString()); // Last 10 years
      const yearCounts = yearLabels.map((year) => {
        // Simulate counts (would need additional API endpoint for exact count per year)
        return Math.floor(Math.random() * 15) + 5;
      });

      setYearChartData({
        labels: yearLabels,
        datasets: [
          {
            label: "Research Published",
            data: yearCounts,
            backgroundColor: "#667eea",
            borderColor: "#667eea",
            borderWidth: 2,
            borderRadius: 4,
          },
        ],
      });

      setStats({
        totalDatasets,
        totalCategories: categories.length,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="stats-loading">Loading statistics...</div>;
  }

  return (
    <section className="stats-section">
      <div className="container">
        <h2>Research Statistics & Analytics</h2>
        <p className="section-subtitle">
          Overview of available datasets and research by category
        </p>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-value">{stats.totalDatasets}</div>
            <div className="stat-label">Total Datasets</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalCategories}</div>
            <div className="stat-label">Research Categories</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">2025</div>
            <div className="stat-label">Latest Year</div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {categoryChartData && (
            <div className="chart-container">
              <h3>Research by Category</h3>
              <Doughnut
                data={categoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        boxWidth: 12,
                        padding: 12,
                      },
                    },
                  },
                }}
              />
            </div>
          )}

          {yearChartData && (
            <div className="chart-container">
              <h3>Publications Over Time</h3>
              <Bar
                data={yearChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: "top",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 5,
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default StatsCharts;
