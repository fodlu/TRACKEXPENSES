import React from "react";
import {
	dashboardStyles,
	trendStyles,
	chartStyles,
} from "../assets/dummyStyles";
import {
	GAUGE_COLORS,
	COLORS,
	INCOME_CATEGORY_ICONS,
	EXPENSE_CATEGORY_ICONS,
} from "../assets/color";

const API_BASE = "http://localhost:4000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const Dashboard = () => {
	return <div>Dashboard</div>;
};

export default Dashboard;
