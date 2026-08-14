import React, { useState, useEffect } from "react";
import Login from "./auth/Login.jsx";
import DiseaseDetection from "./disease/DiseaseDetection.jsx";
import ManagerDashboard from "./dashboards/manager_dashboard.jsx";
import ManagerDashboardMobile from "./dashboards/manager_Dashobard_mobile.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = (pageKey) => {
    setCurrentPage(pageKey);
  };

  if (currentPage === "detection") {
    return <DiseaseDetection onNavigate={handleNavigate} />;
  }

  if (currentPage === "login") {
    return <Login onNavigate={handleNavigate} />;
  }

  if (isMobile || currentPage === "mobile-dashboard") {
    return <ManagerDashboardMobile onNavigate={handleNavigate} />;
  }

  return <ManagerDashboard onNavigate={handleNavigate} />;
}

export default App;