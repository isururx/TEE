<<<<<<< Updated upstream
import React, { useState, useEffect } from "react";
import WelcomePage from "./auth/WelcomePage.jsx";
=======
import React, { useState } from "react";

// Auth & General Pages
>>>>>>> Stashed changes
import Login from "./auth/Login.jsx";
import CreateAccountUser from "./auth/CreateAccountUser.jsx";
import CreateAccountStaff from "./auth/CreateAccountStaff.jsx";
import UserProfile from "./auth/UserProfile.jsx";
import UserProfileForAdmin from "./auth/UserProfileForAdmin.jsx";
import TwoStepVerification from "./auth/TwoStepVerification.jsx";
import OtpResent from "./auth/OtpResent.jsx";

// Developed Feature Components
import DiseaseDetection from "./disease/DiseaseDetection.jsx";
<<<<<<< Updated upstream
import ManagerDashboard from "./dashboards/manager_dashboard.jsx";
import ManagerDashboardMobile from "./dashboards/manager_Dashobard_mobile.jsx";
import SupervisorDashboard from "./dashboards/supervisor_dashboard.jsx";
import SupervisorDashboardMobile from "./dashboards/supervisor_dashboard_mobile.jsx";
=======
>>>>>>> Stashed changes
import StateAnalytics from "./analytics/stateAnalytics.jsx";
import BlockManagement from "./worker_block/block_management.jsx";
import BlockDetail from "./worker_block/block_detail.jsx";
import TaskManagement from "./worker_block/task_management.jsx";
import TrackAttendance from "./worker_block/track_attendence.jsx";
<<<<<<< Updated upstream
import WorkerLogin from "./worker_block/workerlogin.jsx";
import InventoryManagement from "./inventory/inventory_management.jsx";
import SupplierManagement from "./inventory/supplier_management.jsx";
import ActivityLogs from "./auth/ActivityLogs.jsx";
import WorkerManagement from "./worker_block/worker_management.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
=======
import InventoryManagement from "./Inventory/inventory_management.jsx";
import SupplierManagement from "./Inventory/supplier_management.jsx";

// Role-Based Dashboards
import AdminDashboard from "./dashboards/admin_dashboard.jsx";
import ManagerDashboard from "./dashboards/manager_dashboard.jsx";
import SupervisorDashboard from "./dashboards/supervisor_dashboard.jsx";
import WorkerDashboardMobile from "./dashboards/worker_dashboard_mobile.jsx";
import UnderDevelopment from "./dashboards/under_development.jsx";

// Role-Based Sidebars (in src/common components/sidebars/)
import AdminSidebar from "./common components/sidebars/admin_sidebar.jsx";
import ManagerSidebar from "./common components/sidebars/manager_sidebar.jsx";
import SupervisorSidebar from "./common components/sidebars/supervisor_sidebar.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [authData, setAuthData] = useState({});
  const [testRole, setTestRole] = useState("manager"); // 'admin' | 'manager' | 'supervisor' | 'worker'
>>>>>>> Stashed changes

  const handleNavigate = (pageKey, data) => {
    if (data) {
      setAuthData((prev) => ({ ...prev, ...data }));
    }
    setCurrentPage(pageKey);
  };

<<<<<<< Updated upstream
  if (currentPage === "detection") {
    return <DiseaseDetection onNavigate={handleNavigate} />;
  }

  if (currentPage === "welcomePage" || currentPage === "welcome") {
    return <WelcomePage onNavigate={handleNavigate} />;
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

  if (currentPage === "createAccount") {
    return <CreateAccountUser onNavigate={handleNavigate} />;
  }

  if (currentPage === "createAccountStaff") {
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
=======
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
>>>>>>> Stashed changes
    }
  };

<<<<<<< Updated upstream
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
=======
  // Main Page Router with Sidebar Wrap for Developed Pages
  const renderCurrentPage = () => {
    // 1. Auth & Account Pages
    if (currentPage === "login") {
      return <Login onNavigate={handleNavigate} />;
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

    // 2. Developed Feature Pages (Rendered with Role Sidebar)
    if (currentPage === "detection") {
      return <DiseaseDetection onNavigate={handleNavigate} />;
    }
    if (currentPage === "analytics") {
      return <StateAnalytics onNavigate={handleNavigate} />;
    }
    if (currentPage === "users" || currentPage === "userProfileForAdmin" || currentPage === "adminProfile") {
      return <UserProfileForAdmin onNavigate={handleNavigate} />;
    }
    if (currentPage === "suppliers" || currentPage === "supplierManagement") {
      return <SupplierManagement onNavigate={handleNavigate} />;
    }
    if (currentPage === "inventory" || currentPage === "inventoryManagement") {
      return <InventoryManagement onNavigate={handleNavigate} />;
    }
    if (currentPage === "BlockManagement" || currentPage === "blockManagement" || currentPage === "blocks") {
      return <BlockManagement onNavigate={handleNavigate} />;
    }
    if (currentPage === "BlockDetail") {
      return <BlockDetail onNavigate={handleNavigate} />;
    }
    if (currentPage === "TaskManagement" || currentPage === "taskManagement" || currentPage === "tasks") {
      return <TaskManagement onNavigate={handleNavigate} />;
    }
    if (currentPage === "attendance") {
      return <TrackAttendance onNavigate={handleNavigate} />;
    }
    if (currentPage === "profile") {
      return <UserProfile onNavigate={handleNavigate} />;
    }
>>>>>>> Stashed changes

    // 3. Features Under Development (Unimplemented Feature Pages)
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
    if (currentPage === "workerManagement") {
      return <UnderDevelopment featureName="Worker Management" role={testRole} onNavigate={handleNavigate} />;
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
    if (currentPage === "activityLogs") {
      return <UnderDevelopment featureName="Activity Audit Logs" role={testRole} onNavigate={handleNavigate} />;
    }
    if (currentPage === "settings" || currentPage === "system" || currentPage === "systemSettings") {
      return <UnderDevelopment featureName="System Settings" role={testRole} onNavigate={handleNavigate} />;
    }

    // 4. Default / Dashboard Route
    return renderDashboardLayout();
  };

<<<<<<< Updated upstream
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
=======
  return (
    <div>
      {/* ================================================================== */}
      {/* TEST TOOLBAR FOR TESTING ROLE SIDEBARS & FEATURES                  */}
      {/* ================================================================== */}
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
                onClick={() => {
                  setTestRole(role.id);
                  setCurrentPage("dashboard");
                }}
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
            onClick={() => setCurrentPage("dashboard")}
            style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #334155", background: "#1E293B", color: "#FFF", fontSize: "12px" }}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {renderCurrentPage()}
    </div>
  );
>>>>>>> Stashed changes
}

export default App;