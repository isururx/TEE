import React, { useState, useEffect } from "react";
import Login from "./auth/Login.jsx";
import CreateAccountUser from "./auth/CreateAccountUser.jsx";
import CreateAccountStaff from "./auth/CreateAccountStaff.jsx";
import UserProfile from "./auth/UserProfile.jsx";
import UserProfileForAdmin from "./auth/UserProfileForAdmin.jsx";
import TwoStepVerification from "./auth/TwoStepVerification.jsx";
import OtpResent from "./auth/OtpResent.jsx";
import DiseaseDetection from "./disease/DiseaseDetection.jsx";
import ManagerDashboard from "./dashboards/manager_dashboard.jsx";
import ManagerDashboardMobile from "./dashboards/manager_Dashobard_mobile.jsx";
import SupervisorDashboard from "./dashboards/supervisor_dashboard.jsx";
import SupervisorDashboardMobile from "./dashboards/supervisor_dashboard_mobile.jsx";
import AdminDashboard from "./dashboards/admin_dashboard.jsx";
import AdminDashboardMobile from "./dashboards/admin_dashboard_mobile.jsx";
import StateAnalytics from "./analytics/stateAnalytics.jsx";
import BlockManagement from "./worker_block/block_management.jsx";
import BlockDetail from "./worker_block/block_detail.jsx";
import TaskManagement from "./worker_block/task_management.jsx";
import TrackAttendance from "./worker_block/track_attendence.jsx";
import WorkerLogin from "./worker_block/workerlogin.jsx";
import InventoryManagement from "./inventory/inventory_management.jsx";
import SupplierManagement from "./inventory/supplier_management.jsx";


function App() {
  const [currentPage, setCurrentPage] = useState("adminDashboard");


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

  if (currentPage === "workerLogin") {
    return <WorkerLogin onNavigate={handleNavigate} />;
  }

  if (currentPage === "twoStepVerification" || currentPage === "verification" || currentPage === "otp") {
    return <TwoStepVerification onNavigate={handleNavigate} email="user***@gmail.com" />;
  }

  if (currentPage === "otpResent") {
    return <OtpResent onNavigate={handleNavigate} onReturn={() => handleNavigate("twoStepVerification")} />;
  }

  if (currentPage === "createAccount" ) {
    return <CreateAccountUser onNavigate={handleNavigate} />;
  }

  if (currentPage === "createAccountStaff" ) {
    return <CreateAccountStaff onNavigate={handleNavigate} />;
  }

  if (currentPage === "profile") {
    return <UserProfile onNavigate={handleNavigate} />;
  }

  if (currentPage === "userProfileForAdmin" || currentPage === "adminProfile") {
    return <UserProfileForAdmin onNavigate={handleNavigate} />;
  }

  if (currentPage === "dashboard" || currentPage === "managerDashboard") {
    if (isMobile) {
      return <ManagerDashboardMobile onNavigate={handleNavigate} />;
    }
    return <ManagerDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === "mobile-dashboard") {
    return <ManagerDashboardMobile onNavigate={handleNavigate} />;
  }

  if (currentPage === "supervisorDashboard" || currentPage === "supervisor-dashboard" || currentPage === "supervisor") {
    if (isMobile) {
      return <SupervisorDashboardMobile onNavigate={handleNavigate} />;
    }
    return <SupervisorDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === "mobile-supervisor-dashboard") {
    return <SupervisorDashboardMobile onNavigate={handleNavigate} />;
  }

  if (currentPage === "adminDashboard" || currentPage === "admin-dashboard" || currentPage === "admin") {
    if (isMobile) {
      return <AdminDashboardMobile onNavigate={handleNavigate} />;
    }
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === "mobile-admin-dashboard") {
    return <AdminDashboardMobile onNavigate={handleNavigate} />;
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
 if (currentPage === "inventory") {
    return <InventoryManagement onNavigate={handleNavigate} />;
  }

  if (currentPage === "suppliers") {
    return <SupplierManagement onNavigate={handleNavigate} />;
  }
  return <StateAnalytics onNavigate={handleNavigate} />;
}

export default App;