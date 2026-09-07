import React, { useState } from "react";

// Auth & General Pages
import WelcomePage from "./auth/WelcomePage.jsx";
import Login from "./auth/Login.jsx";
import CreateAccountUser from "./auth/CreateAccountUser.jsx";
import CreateAccountStaff from "./auth/CreateAccountStaff.jsx";
import UserProfile from "./auth/UserProfile.jsx";
import UserProfileForAdmin from "./auth/UserProfileForAdmin.jsx";
import TwoStepVerification from "./auth/TwoStepVerification.jsx";
import OtpResent from "./auth/OtpResent.jsx";
import ActivityLogs from "./auth/ActivityLogs.jsx";

// Developed Feature Components
import DiseaseDetection from "./disease/DiseaseDetection.jsx";
import StateAnalytics from "./analytics/stateAnalytics.jsx";
import BlockManagement from "./worker_block/block_management.jsx";
import BlockDetail from "./worker_block/block_detail.jsx";
import TaskManagement from "./worker_block/task_management.jsx";
import TrackAttendance from "./worker_block/track_attendence.jsx";
import WorkerManagement from "./worker_block/worker_management.jsx";
import InventoryManagement from "./Inventory/inventory_management.jsx";
import SupplierManagement from "./Inventory/supplier_management.jsx";

// Role-Based Dashboards
import AdminDashboard from "./dashboards/admin_dashboard.jsx";
import ManagerDashboard from "./dashboards/manager_dashboard.jsx";
import SupervisorDashboard from "./dashboards/supervisor_dashboard.jsx";
import WorkerDashboardMobile from "./dashboards/worker_dashboard_mobile.jsx";
import UnderDevelopment from "./dashboards/under_development.jsx";

// Role-Based Sidebars
import AdminSidebar from "./common components/sidebars/admin_sidebar.jsx";
import ManagerSidebar from "./common components/sidebars/manager_sidebar.jsx";
import SupervisorSidebar from "./common components/sidebars/supervisor_sidebar.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [authData, setAuthData] = useState({});
  const [testRole, setTestRole] = useState(() => {
    return localStorage.getItem("user_role") || "manager";
  });

  const handleRoleChange = (newRole) => {
    setTestRole(newRole);
    localStorage.setItem("user_role", newRole);
    setCurrentPage("dashboard");
  };

  const handleNavigate = (pageKey, data) => {
    if (data) {
      setAuthData((prev) => ({ ...prev, ...data }));
      if (data.role) {
        localStorage.setItem("user_role", data.role);
        setTestRole(data.role.toLowerCase());
      }
    }
    setCurrentPage(pageKey);
  };

  const renderDashboardLayout = () => {
    switch (testRole) {
      case "admin":
        return (
          <div style={{ display: "flex", flex: 1, minHeight: "100vh", width: "100%" }}>
            <AdminSidebar activeItem={currentPage} onNavigate={handleNavigate} />
            <AdminDashboard onNavigate={handleNavigate} />
          </div>
        );
      case "supervisor":
        return (
          <div style={{ display: "flex", flex: 1, minHeight: "100vh", width: "100%" }}>
            <SupervisorSidebar activeItem={currentPage} onNavigate={handleNavigate} />
            <SupervisorDashboard onNavigate={handleNavigate} />
          </div>
        );
      case "worker":
        return <WorkerDashboardMobile onNavigate={handleNavigate} />;
      case "manager":
      default:
        return (
          <div style={{ display: "flex", flex: 1, minHeight: "100vh", width: "100%" }}>
            <ManagerSidebar activeItem={currentPage} onNavigate={handleNavigate} />
            <ManagerDashboard onNavigate={handleNavigate} />
          </div>
        );
    }
  };

  const renderCurrentPage = () => {
    // 1. Auth & Account Pages
    if (currentPage === "login" || currentPage === "workerLogin") {
      return <Login onNavigate={handleNavigate} />;
    }
    if (currentPage === "welcomePage" || currentPage === "welcome") {
      return <WelcomePage onNavigate={handleNavigate} />;
    }
    if (currentPage === "twoStepVerification" || currentPage === "verification" || currentPage === "otp") {
      return (
        <TwoStepVerification
          onNavigate={handleNavigate}
          userId={authData.user_id}
          role={authData.role}
          user={authData.user}
          email="user***@gmail.com"
        />
      );
    }
    if (currentPage === "otpResent") {
      return <OtpResent onNavigate={handleNavigate} onReturn={() => handleNavigate("twoStepVerification")} />;
    }
    if (currentPage === "createAccount") {
      return <CreateAccountUser onNavigate={handleNavigate} />;
    }
    if (currentPage === "createAccountStaff") {
      return <CreateAccountStaff onNavigate={handleNavigate} />;
    }

    // 2. Developed Feature Pages
    if (currentPage === "detection") {
      return <DiseaseDetection role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "analytics") {
      return <StateAnalytics role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "users" || currentPage === "userProfileForAdmin" || currentPage === "adminProfile") {
      return <UserProfileForAdmin role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "suppliers" || currentPage === "supplierManagement") {
      return <SupplierManagement role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "inventory" || currentPage === "inventoryManagement") {
      return <InventoryManagement role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "BlockManagement" || currentPage === "blockManagement" || currentPage === "blocks") {
      return <BlockManagement role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "BlockDetail") {
      return <BlockDetail role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "TaskManagement" || currentPage === "taskManagement" || currentPage === "tasks") {
      return <TaskManagement role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "WorkerManagement" || currentPage === "workerManagement" || currentPage === "workers") {
      return <WorkerManagement role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "attendance") {
      return <TrackAttendance role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "profile") {
      return <UserProfile role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "activityLogs" || currentPage === "activity-logs" || currentPage === "logs") {
      return <ActivityLogs role={testRole} onNavigate={handleNavigate} />;
    }

    // 3. Features Under Development
    if (currentPage === "accountApprovals") {
      return <UnderDevelopment featureName="Account Approvals" role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "roleAssignment") {
      return <UnderDevelopment featureName="Role Assignment" role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "diseaseAnalytics") {
      return <UnderDevelopment featureName="Disease Analytics" role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "treatment") {
      return <UnderDevelopment featureName="Treatment Recommendations" role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "blockHistory") {
      return <UnderDevelopment featureName="Block Activity History" role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "workerAssignment") {
      return <UnderDevelopment featureName="Worker-Block Assignment" role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "stockInOut" || currentPage === "stockTracking") {
      return <UnderDevelopment featureName="Stock Tracking" role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "lowStock") {
      return <UnderDevelopment featureName="Low Stock Alerts" role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "inventoryAnalytics") {
      return <UnderDevelopment featureName="Inventory Analytics" role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "reports" || currentPage === "exportReports") {
      return <UnderDevelopment featureName="Reports & Audits" role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "settings" || currentPage === "system" || currentPage === "systemSettings") {
      return <UnderDevelopment featureName="System Settings" role={testRole} onNavigate={handleNavigate} />;
    }

    // 4. Default / Dashboard Route
    return renderDashboardLayout();
  };

  return (
    <div>
      {/* TEST TOOLBAR FOR TESTING ROLE SIDEBARS & FEATURES */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 99999,
          background: "#0F172A",
          color: "#FFFFFF",
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          borderBottom: "2px solid #10B981",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontWeight: "bold", fontSize: "13px", color: "#34D399" }}>
            🧪 TESTER:
          </span>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[
              { id: "admin", label: "👑 Admin" },
              { id: "manager", label: "🏢 Estate Manager" },
              { id: "supervisor", label: "👷 Supervisor" },
              { id: "worker", label: "🌱 Field Worker" },
            ].map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleChange(role.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: testRole === role.id ? "#10B981" : "#1E293B",
                  color: "#FFFFFF",
                  fontWeight: testRole === role.id ? "bold" : "normal",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setCurrentPage("login")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #334155",
              background: currentPage === "login" ? "#10B981" : "#1E293B",
              color: "#FFF",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Login Page
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage("dashboard")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #334155",
              background: currentPage === "dashboard" ? "#10B981" : "#1E293B",
              color: "#FFF",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {renderCurrentPage()}
    </div>
  );
}

export default App;