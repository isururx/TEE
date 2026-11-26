import { useState, useEffect, useCallback } from "react";

const DASHBOARD_API_BASE = "http://localhost:8000/api/dashboard";

/**
 * Shared hook for Manager & Supervisor dashboards (desktop + mobile)
 * to load live database records and persist supplier / history actions.
 */
export function useOperationsDashboard() {
  const [workers, setWorkers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [attendancePct, setAttendancePct] = useState(0);

  const refresh = useCallback((signal) => {
    fetch(`${DASHBOARD_API_BASE}/operations`, signal ? { signal } : undefined)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setWorkers(Array.isArray(data.workers) ? data.workers : []);
        setSupervisors(Array.isArray(data.supervisors) ? data.supervisors : []);
        setBlocks(Array.isArray(data.blocks) ? data.blocks : []);
        setSuppliers(Array.isArray(data.suppliers) ? data.suppliers : []);
        setLowStockItems(Array.isArray(data.low_stock_items) ? data.low_stock_items : []);
        setAssignedTasks(Array.isArray(data.assigned_tasks) ? data.assigned_tasks : []);
        setAttendancePct(data.attendance_percentage ?? 0);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  const addSupplier = async (newSupplierData) => {
    try {
      const res = await fetch(`${DASHBOARD_API_BASE}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplierData),
      });
      if (res.ok) {
        const created = await res.json();
        setSuppliers((prev) => [...prev, created]);
        return created;
      }
    } catch {
      // ignore network error
    }
    return null;
  };

  const removeSupplier = async (id) => {
    try {
      const res = await fetch(`${DASHBOARD_API_BASE}/suppliers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuppliers((prev) => prev.filter((s) => s.id !== id));
        return true;
      }
    } catch {
      // ignore network error
    }
    return false;
  };

  const clearDiseaseHistory = async (blockId) => {
    const numericId = Number(String(blockId).replace(/\D/g, "")) || 0;
    if (!numericId) return false;
    try {
      const res = await fetch(`${DASHBOARD_API_BASE}/disease-history/${numericId}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  return {
    workers,
    setWorkers,
    supervisors,
    blocks,
    suppliers,
    lowStockItems,
    assignedTasks,
    setAssignedTasks,
    attendancePct,
    addSupplier,
    removeSupplier,
    clearDiseaseHistory,
    refresh,
  };
}
