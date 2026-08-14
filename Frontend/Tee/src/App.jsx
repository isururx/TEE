import React, { useState, useEffect } from "react";
import Login from "./auth/Login.jsx";
import DiseaseDetection from "./disease/DiseaseDetection.jsx";
import ManagerDashboard from "./dashboards/manager_dashboard.jsx";
import ManagerDashboardMobile from "./dashboards/manager_Dashobard_mobile.jsx";
import StateAnalytics from "./analytics/stateAnalytics.jsx";
import BlockManagement from "./worker_block/block_management.jsx";
import BlockDetail from "./worker_block/block_detail.jsx";
import TaskManagement from "./worker_block/task_management.jsx";
import TrackAttendance from "./worker_block/track_attendence.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("analytics");
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

  if (currentPage === "dashboard") {
    if (isMobile) {
      return <ManagerDashboardMobile onNavigate={handleNavigate} />;
    }
    return <ManagerDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === "mobile-dashboard") {
    return <ManagerDashboardMobile onNavigate={handleNavigate} />;
  }

  if (currentPage === "BlockManagement") {
    return <BlockManagement onNavigate={handleNavigate} />;
  }

  if (currentPage === "BlockDetail") {
    return <BlockDetail onNavigate={handleNavigate} />;
  }

  if (currentPage === "TaskManagement" || currentPage === "tasks") {
    return <TaskManagement onNavigate={handleNavigate} />;
  }

  if (currentPage === "attendance") {
    return <TrackAttendance onNavigate={handleNavigate} />;
  }

  return <StateAnalytics onNavigate={handleNavigate} />;
}

export default App;