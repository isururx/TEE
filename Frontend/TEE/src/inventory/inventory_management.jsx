import React, { useState } from 'react';
import Header from "../common components/header.jsx";
import RoleSidebar from "../common components/sidebars/RoleSidebar.jsx";
import Footer from "../common components/footer.jsx";
import { 
  ChevronDown,
  Plus,
  Search,
  Package,
  AlertTriangle,
  History,
  X,
  User,
  Building,
  ArrowRightLeft,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

const InventoryManagement = ({ onNavigate = () => {} }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [activeModal, setActiveModal] = useState(null); // 'addItems' | 'recentMovements' | null
  const [stockActionType, setStockActionType] = useState('Stock In'); // 'Stock In' | 'Stock Out'

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <Header 
        title="Inventory" 
        crumbs={[{ label: "Home", href: "#" }, { label: "Inventory", href: "#" }]} 
        user={{ name: "Hasanth J", role: "Estate Manager", initials: "HJ" }}
      />

      <div style={{ display: "flex", minHeight: "calc(100vh - var(--topbar-height))" }}>
        <RoleSidebar activeItem="inventory" onNavigate={onNavigate} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <main style={{ flex: 1, padding: "var(--space-6) var(--space-8)" }}>
            <div style={{ maxWidth: "var(--content-max-width)", margin: "0 auto" }}>
              
              {/* Top Cards */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
                gap: "var(--space-6)", 
                marginBottom: "var(--space-8)" 
              }}>
                <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100px" }}>
                  <span style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-medium)" }}>Total Items</span>
                </div>
                <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100px", borderTop: "4px solid var(--color-warning)" }}>
                  <span style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-medium)", marginBottom: "4px" }}>Lowest Stock</span>
                  <span className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>ITEM : Quantity</span>
                </div>
                <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100px" }}>
                  <span style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-medium)", textAlign: "center" }}>Active<br/>Suppliers</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-8)", flexWrap: "wrap", alignItems: "flex-start" }}>
                {/* Left Content Area (Main) */}
                <div style={{ flex: "1 1 60%" }}>
                  
                  {/* Search */}
                  <div style={{ marginBottom: "var(--space-4)", display: "inline-block" }}>
                    <div className="input-search" style={{ background: "var(--color-card)", cursor: "pointer", padding: "var(--space-2) var(--space-4)" }}>
                      <span style={{ marginRight: "var(--space-2)", fontWeight: "var(--fw-medium)", color: "var(--color-text-primary)" }}>Search items</span>
                      <div style={{ background: "var(--color-text-muted)", borderRadius: "var(--radius-sm)", padding: "2px" }}>
                        <ChevronDown size={14} color="white" />
                      </div>
                    </div>
                  </div>

                  {/* Catalogue Card */}
                  <div className="card" style={{ position: "relative", paddingBottom: "var(--space-10)" }}>
                    <div className="flex-between" style={{ marginBottom: "var(--space-6)" }}>
                      <h2 style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-semibold)" }}>Item Catalogue</h2>
                      <button className="btn-secondary" style={{ padding: "var(--space-2) var(--space-4)", borderRadius: "var(--radius-full)" }}>
                        export
                      </button>
                    </div>

                    {/* Tabs */}
                    <div style={{ 
                      display: "flex", 
                      gap: "var(--space-6)", 
                      borderBottom: "1px solid var(--color-border)", 
                      paddingBottom: "var(--space-2)", 
                      marginBottom: "var(--space-6)",
                      overflowX: "auto"
                    }}>
                      {['All', 'Fungicides', 'Pesticides', 'Fertilizers', 'Equipment', 'Tools'].map(tab => (
                        <span 
                          key={tab} 
                          onClick={() => setActiveTab(tab)}
                          style={{ 
                            fontSize: "var(--fs-sm)", 
                            cursor: "pointer", 
                            fontWeight: activeTab === tab ? "var(--fw-semibold)" : "var(--fw-normal)",
                            color: activeTab === tab ? "var(--color-primary)" : "var(--color-text-secondary)",
                            borderBottom: activeTab === tab ? "2px solid var(--color-primary)" : "none",
                            paddingBottom: activeTab === tab ? "var(--space-2)" : "0",
                            marginBottom: activeTab === tab ? `calc(-1 * var(--space-2) - 1px)` : "0"
                          }}
                        >
                          {tab}
                        </span>
                      ))}
                    </div>

                    {/* Status Filters */}
                    <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-6)", flexWrap: "wrap" }}>
                      <button className="btn-secondary" style={{ borderRadius: "var(--radius-full)", padding: "4px 16px" }}>All Status</button>
                      <button className="btn-ghost" style={{ background: "var(--color-bg)", borderRadius: "var(--radius-full)", padding: "4px 16px" }}>In Stock</button>
                      <button className="btn-ghost" style={{ background: "var(--color-bg)", borderRadius: "var(--radius-full)", padding: "4px 16px" }}>Low Stock</button>
                      <button className="btn-ghost" style={{ background: "var(--color-bg)", borderRadius: "var(--radius-full)", padding: "4px 16px" }}>Critical</button>
                    </div>

                    {/* Table */}
                    <div className="table-responsive" style={{ minHeight: "300px" }}>
                      <table className="table-modern">
                        <thead>
                          <tr>
                            <th>ITEM</th>
                            <th>Category</th>
                            <th>LOCATION</th>
                            <th>STOCK LEVEL</th>
                            <th>QTY</th>
                            <th>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Empty state to match wireframe's gray box area */}
                          <tr>
                            <td colSpan="6" style={{ height: "200px", background: "var(--color-hover-green)", borderRadius: "var(--radius-md)" }}></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Add Items Floating Button */}
                    <div style={{ position: "absolute", bottom: "10px", right: "var(--space-6)" }}>
                      <button 
                        className="btn-primary" 
                        onClick={() => setActiveModal('addItems')}
                        style={{ padding: "var(--space-3) var(--space-5)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-hover)" }}>
                        <Plus size={20} />
                        <span style={{ textAlign: "left" }}>Add items</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Content Area (Sidebar-ish) */}
                <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                  
                  {/* Low Stock Alerts */}
                  <div className="card" style={{ background: "var(--color-bg)" }}>
                    <div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
                      <span style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>Low Stock Alerts</span>
                      <span className="badge-info" style={{ fontSize: "10px", background: "var(--color-card)" }}>Remaining Item Qty</span>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                      {[1, 2, 3].map(item => (
                        <div key={item} className="flex-between" style={{ fontSize: "var(--fs-sm)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-text-muted)" }}></div>
                            <span style={{ color: "var(--color-text-primary)" }}>Item {item}</span>
                          </div>
                          <a href="#" style={{ fontSize: "var(--fs-xs)" }}>Reorder</a>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ marginTop: "var(--space-4)", textAlign: "right" }}>
                      <a href="#" style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-medium)" }}>View All</a>
                    </div>
                  </div>

                  {/* Recent Movements Button */}
                  <button 
                    onClick={() => setActiveModal('recentMovements')}
                    className="btn-primary" 
                    style={{ width: "100%", padding: "var(--space-4)", fontSize: "var(--fs-md)", background: "var(--color-hover-green)" , color: "var(--color-text-primary)" }}>
                    <History size={18} style={{ marginRight: "var(--space-2)" }} />
                    Recent Movements
                  </button>

                </div>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>

      {/* --------------------------------------------------------------------
         MODALS / DIALOGS
         -------------------------------------------------------------------- */}

      {/* 1. Add Items / Register Movement Modal */}
      {activeModal === "addItems" && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", 
          background: "rgba(0,0,0,0.5)", zIndex: "var(--z-modal-backdrop)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "var(--space-4)"
        }}>
          <div className="card" style={{ width: "100%", maxWidth: "600px", padding: 0, overflow: "hidden" }}>
            
            {/* Modal Header Tabs */}
            <div style={{ display: "flex", background: "var(--color-hover-green)" }}>
              <div 
                onClick={() => setStockActionType("Stock In")}
                style={{ 
                  flex: 1, padding: "var(--space-4)", textAlign: "center", cursor: "pointer",
                  background: stockActionType === "Stock In" ? "var(--color-card)" : "transparent",
                  fontWeight: stockActionType === "Stock In" ? "var(--fw-bold)" : "var(--fw-medium)",
                  borderTopLeftRadius: "var(--radius-lg)",
                  boxShadow: stockActionType === "Stock In" ? "var(--shadow-soft)" : "none"
                }}
              >
                Stock In
              </div>
              <div 
                onClick={() => setStockActionType("Stock Out")}
                style={{ 
                  flex: 1, padding: "var(--space-4)", textAlign: "center", cursor: "pointer",
                  background: stockActionType === "Stock Out" ? "var(--color-card)" : "transparent",
                  fontWeight: stockActionType === "Stock Out" ? "var(--fw-bold)" : "var(--fw-medium)",
                  borderTopRightRadius: "var(--radius-lg)",
                  color: "var(--color-text-secondary)",
                  boxShadow: stockActionType === "Stock Out" ? "var(--shadow-soft)" : "none"
                }}
              >
                Stock Out
              </div>
            </div>

            <div style={{ padding: "var(--space-6)" }}>
              <div className="flex-between" style={{ marginBottom: "var(--space-6)" }}>
                <h3 style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)" }}>Register Movement</h3>
                <button className="btn-icon" onClick={() => setActiveModal(null)}><X size={18} /></button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Date of Movement</label>
                  <input type="date" className="input-primary" />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Item Selection</label>
                  <select className="input-primary">
                    <option>Organic Fertilizer (Type A)</option>
                    <option>Copper Fungicide</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Quantity</label>
                  <div style={{ display: "flex" }}>
                    <input type="number" className="input-primary" placeholder="0.00" style={{ borderRight: "none", borderTopRightRadius: 0, borderBottomRightRadius: 0 }} />
                    <span style={{ 
                      background: "var(--color-hover-green)", 
                      border: "1px solid var(--color-border)", 
                      display: "flex", alignItems: "center", padding: "0 var(--space-4)",
                      borderTopRightRadius: "var(--radius-md)", borderBottomRightRadius: "var(--radius-md)",
                      fontSize: "var(--fs-sm)", color: "var(--color-text-secondary)"
                    }}>
                      Units
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Person Responsible</label>
                  <div style={{ position: "relative" }}>
                    <User size={14} color="var(--color-text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                    <input type="text" className="input-primary" placeholder="Search personnel..." style={{ paddingLeft: "32px" }} />
                  </div>
                </div>

              </div>

              <div className="form-group" style={{ marginTop: "var(--space-4)" }}>
                <label className="form-label" style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Purpose / Notes</label>
                <textarea className="input-primary" placeholder="Brief description of the movement..."></textarea>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-4)", marginTop: "var(--space-6)" }}>
                <button type="button" className="btn-ghost" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="button" className="btn-primary" style={{ background: "black" }} onClick={() => setActiveModal(null)}>
                  Confirm {stockActionType}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

   {/* 2. Recent Transfers Table Modal */}
{activeModal === "recentMovements" && (
  <div style={{
    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", 
    background: "rgba(0,0,0,0.5)", zIndex: "var(--z-modal-backdrop)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "var(--space-4)"
  }}>
    <div className="card" style={{ width: "100%", maxWidth: "900px", padding: 0, overflow: "hidden", background: "var(--color-bg)" }}>
      
      <div className="flex-between" style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid #dfdbd2" }}>
        <h3 style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)", color: "var(--color-dark-green)" }}>Recent Transfers</h3>
        <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
          <button className="btn-secondary" style={{ background: "var(--color-hover-green)", borderRadius: "var(--radius-full)", padding: "var(--space-2) var(--space-4)", fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)" }}>
            FILTER
          </button>
          <button className="btn-icon" onClick={() => setActiveModal(null)} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="table-responsive" style={{ background: "#f0ede6" }}>
        {/* Table content unchanged */}
      </div>

      <div className="flex-between" style={{ padding: "var(--space-4) var(--space-6)", color: "var(--color-text-muted)", fontSize: "var(--fs-xs)" }}>
        <span>Showing 4 of 128 logs</span>
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <span style={{ cursor: "pointer" }}>&lt;</span>
          <span style={{ cursor: "pointer" }}>&gt;</span>
        </div>
      </div>

    </div>
  </div>
)}


    </div>
  );
};

export default InventoryManagement;
