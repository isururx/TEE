import React, { useState, useEffect } from "react";
import Login from "./auth/Login.jsx";
import ForgotPassword from "./auth/ForgotPassword.jsx";
import CreateAccountUser from "./auth/CreateAccountUser.jsx";
import UserProfile from "./auth/UserProfile.jsx";
import UserProfileForAdmin from "./auth/UserProfileForAdmin.jsx";
import TwoStepVerification from "./auth/TwoStepVerification.jsx";
import OtpResent from "./auth/OtpResent.jsx";
import DiseaseDetection from "./disease/DiseaseDetection.jsx";
import AdminDashboard from "./dashboards/admin_dashboard.jsx";
import ManagerDashboard from "./dashboards/manager_dashboard.jsx";
import ManagerDashboardMobile from "./dashboards/manager_Dashobard_mobile.jsx";
import SupervisorDashboard from "./dashboards/supervisor_dashboard.jsx";
import SupervisorDashboardMobile from "./dashboards/supervisor_dashboard_mobile.jsx";
import WorkerDashboard from "./dashboards/worker_dashboard.jsx";
import StateAnalytics from "./analytics/stateAnalytics.jsx";
import BlockManagement from "./worker_block/block_management.jsx";
import BlockDetail from "./worker_block/block_detail.jsx";
import TaskManagement from "./worker_block/task_management.jsx";
import TrackAttendance from "./worker_block/track_attendence.jsx";
import InventoryManagement from "./inventory/inventory_management.jsx";
import SupplierManagement from "./inventory/supplier_management.jsx";
import ActivityLogs from "./auth/ActivityLogs.jsx";
import WorkerManagement from "./worker_block/worker_management.jsx";
import WorkerMyTasks from "./worker_block/WorkerMyTasks.jsx";
import { getStoredRole } from "./common components/sidebars/RoleSidebar.jsx";
import { getAccessToken, loadCurrentUser, clearSession } from "./auth/authSession.js";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [authReady, setAuthReady] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);


  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      if (!getAccessToken()) {
        if (active) setAuthReady(true);
        return;
      }
      try {
        const user = await loadCurrentUser();
        if (active) {
          setAuthenticatedUser(user);
          if (user.role) localStorage.setItem("user_role", user.role);
          setCurrentPage("dashboard");
        }
      } catch (error) {
        clearSession();
        if (active) {
          setAuthenticatedUser(null);
          setCurrentPage("login");
        }
      } finally {
        if (active) setAuthReady(true);
      }
    };
    const handleAuthChanged = (event) => {
      const user = event?.detail?.user || null;
      setAuthenticatedUser(user);
      if (!user) setCurrentPage("login");
    };
    restoreSession();
    window.addEventListener("tee-auth-changed", handleAuthChanged);
    return () => {
      active = false;
      window.removeEventListener("tee-auth-changed", handleAuthChanged);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleGlobalNavigate = (event) => {
      if (event?.detail) setCurrentPage(event.detail);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("tee-navigate", handleGlobalNavigate);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("tee-navigate", handleGlobalNavigate);
    };
  }, []);

  const handleNavigate = (pageKey) => {
    setCurrentPage(pageKey);
  };

  if (!authReady) {
    return (
      <div className="flex-center" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
        <p>Restoring your session...</p>
      </div>
    );
  }

  const publicPages = ["login", "welcomePage", "welcome", "workerLogin", "forgotPassword", "forgot-password", "twoStepVerification", "verification", "otp", "otpResent", "createAccount", "createAccountStaff", "users"];
  if (!authenticatedUser && !publicPages.includes(currentPage)) {
    return <Login onNavigate={handleNavigate} />;
  }

  if (currentPage === "detection") {
    return <DiseaseDetection onNavigate={handleNavigate} />;
  }

  if (currentPage === "login" || currentPage === "welcomePage" || currentPage === "welcome" || currentPage === "workerLogin") {
    return <Login onNavigate={handleNavigate} />;
  }

  if (currentPage === "forgotPassword" || currentPage === "forgot-password") {
    return <ForgotPassword onNavigate={handleNavigate} />;
  }

  if (currentPage === "twoStepVerification" || currentPage === "verification" || currentPage === "otp") {
    return <TwoStepVerification onNavigate={handleNavigate} email={localStorage.getItem("verification_email") || "your registered email"} />;
  }

  if (currentPage === "otpResent") {
    return <OtpResent onNavigate={handleNavigate} onReturn={() => handleNavigate("twoStepVerification")} />;
  }

  if (currentPage === "createAccount" || currentPage === "createAccountStaff" || currentPage === "users") {
    return <CreateAccountUser onNavigate={handleNavigate} />;
  }

  if (currentPage === "profile") {
    return <UserProfile onNavigate={handleNavigate} />;
  }

  if (currentPage === "userProfileForAdmin" || currentPage === "adminProfile") {
    return <UserProfileForAdmin onNavigate={handleNavigate} />;
  }

  if (currentPage === "dashboard") {
    const role = getStoredRole();
    if (role.includes("worker") || role.includes("field")) {
      return <WorkerMyTasks onNavigate={handleNavigate} />;
    }
    if (role.includes("admin")) {
      return <AdminDashboard onNavigate={handleNavigate} />;
    }
    if (role.includes("supervisor")) {
      if (isMobile) return <SupervisorDashboardMobile onNavigate={handleNavigate} />;
      return <SupervisorDashboard onNavigate={handleNavigate} />;
    }
    if (role.includes("worker")) {
      return <WorkerDashboard onNavigate={handleNavigate} />;
    }
    if (isMobile) return <ManagerDashboardMobile onNavigate={handleNavigate} />;
    return <ManagerDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === "adminDashboard") {
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === "managerDashboard") {
    if (isMobile) return <ManagerDashboardMobile onNavigate={handleNavigate} />;
    return <ManagerDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === "workerDashboard" || currentPage === "worker-dashboard" || currentPage === "worker") {
    return <WorkerDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === "WorkerManagement" || currentPage === "workers") {
    return <WorkerManagement onNavigate={handleNavigate} />;
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

  if (currentPage === "BlockManagement") {
    return <BlockManagement onNavigate={handleNavigate} />;
  }

  if (currentPage === "BlockDetail") {
    return <BlockDetail onNavigate={handleNavigate} />;
  }

  if (currentPage === "myTasks" || currentPage === "MyTasks" || currentPage === "workerTasks" || currentPage === "worker-tasks") {
    return <WorkerMyTasks onNavigate={handleNavigate} />;
  }

  if (currentPage === "TaskManagement" || currentPage === "tasks") {
    const role = getStoredRole();
    if (role.includes("worker")) {
      return <WorkerDashboard onNavigate={handleNavigate} initialTab="tasks" />;
    }
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

  if (currentPage === "activityLogs" || currentPage === "activity-logs" || currentPage === "logs") {
    return <ActivityLogs onNavigate={handleNavigate} />;
  }

  return <StateAnalytics onNavigate={handleNavigate} />;
}

export default App;