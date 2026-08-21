import React, { useState } from 'react';
import Header from "../common components/header.jsx";
import Sidebar from "../common components/sidebar.jsx";
import Footer from "../common components/footer.jsx";
import { 
  Plus,
  Trash2,
  Edit2,
  MapPin,
  Phone,
  Mail,
  ShoppingCart,
  FileText,
  X,
  Search,
  ChevronDown
} from 'lucide-react';

const SupplierManagement = ({ onNavigate = () => {} }) => {
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | null
  const [selectedSupplierId, setSelectedSupplierId] = useState(1);
  const [activeTab, setActiveTab] = useState('All');

  const suppliers = [
    {
      id: 1,
      initials: 'NL',
      name: 'Nilani Logistics Ltd.',
      categories: ['PACKAGING'],
      contactName: 'K. Ratnayake',
      contactEmail: 'k.rat@nilani.com',
      status: 'Active',
      details: {
        idStr: 'SUP-2024-008',
        location: 'Colombo, Western Province',
        phone: '+94 11 234 5678',
        activity: [
          { icon: ShoppingCart, title: 'Batch order #88229 processed', subtitle: '3 days ago • $1,240.00' },
          { icon: FileText, title: 'Updated SLA terms signed', subtitle: 'Aug 14, 2023' }
        ]
      }
    },
    {
      id: 2,
      initials: 'GF',
      name: 'GreenField Fertilizers',
      categories: ['FERTILIZER'],
      contactName: 'S. Perera',
      contactEmail: 'supply@greenfield.lk',
      status: 'Active',
      details: {
        idStr: 'SUP-2024-009',
        location: 'Kandy, Central Province',
        phone: '+94 81 234 5678',
        activity: [
          { icon: ShoppingCart, title: 'Batch order #88230 processed', subtitle: '5 days ago • $3,450.00' }
        ]
      }
    },
    {
      id: 3,
      initials: 'HT',
      name: 'High-Tech Agri Gear',
      categories: ['FERTILIZER', 'EQUIPMENT'],
      contactName: 'M. Fernando',
      contactEmail: 'fernando@htagri.com',
      status: 'Under review',
      details: {
        idStr: 'SUP-2024-010',
        location: 'Galle, Southern Province',
        phone: '+94 91 234 5678',
        activity: [
          { icon: FileText, title: 'Initial vendor assessment', subtitle: '1 week ago' }
        ]
      }
    },
    {
      id: 4,
      initials: 'SP',
      name: 'Silver Plume Bags',
      categories: ['PACKAGING'],
      contactName: 'J. de Silva',
      contactEmail: 'jd@silverplume.lk',
      status: 'Active',
      details: {
        idStr: 'SUP-2024-011',
        location: 'Nuwara Eliya, Central Province',
        phone: '+94 52 234 5678',
        activity: [
          { icon: ShoppingCart, title: 'Batch order #88190 processed', subtitle: '2 weeks ago • $540.00' }
        ]
      }
    }
  ];

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <Header 
        title="Supplier Management" 
        crumbs={[{ label: "Home", href: "#" }, { label: "Suppliers", href: "#" }]} 
        user={{ name: "Hasanth J", role: "Estate Manager", initials: "HJ" }}
      />

      <div style={{ display: "flex", minHeight: "calc(100vh - var(--topbar-height))" }}>
        <Sidebar activeItem="suppliers" onNavigate={onNavigate} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <main style={{ flex: 1, padding: "var(--space-6) var(--space-8)" }}>
            <div style={{ maxWidth: "var(--content-max-width)", margin: "0 auto" }}>
              
            

              <div style={{ display: "flex", gap: "var(--space-8)", flexWrap: "wrap", alignItems: "flex-start" }}>
                
                {/* Left Area (Catalogue & Table) */}
                <div style={{ flex: "1 1 60%" }}>
                  
                  {/* Search Bar */}
                  <div style={{ marginBottom: "var(--space-4)", display: "inline-block" }}>
                    <div className="input-search" style={{ background: "var(--color-card)", cursor: "pointer", padding: "var(--space-2) var(--space-4)" }}>
                      <span style={{ marginRight: "var(--space-2)", fontWeight: "var(--fw-medium)", color: "var(--color-text-primary)" }}>Search suppliers</span>
                      <div style={{ background: "var(--color-text-muted)", borderRadius: "var(--radius-sm)", padding: "2px" }}>
                        <ChevronDown size={14} color="white" />
                      </div>
                    </div>
                  </div>

                  {/* Main Catalogue Card */}
                  <div className="card" style={{ position: "relative", paddingBottom: "var(--space-10)" }}>
                    <div className="flex-between" style={{ marginBottom: "var(--space-6)" }}>
                      <h2 style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-semibold)" }}>Supplier Directory</h2>
                      <button className="btn-secondary" style={{ padding: "var(--space-2) var(--space-4)", borderRadius: "var(--radius-full)" }}>
                        export
                      </button>
                    </div>

                    {/* Category Tabs */}
                    <div style={{ 
                      display: "flex", 
                      gap: "var(--space-6)", 
                      borderBottom: "1px solid var(--color-border)", 
                      paddingBottom: "var(--space-2)", 
                      marginBottom: "var(--space-6)",
                      overflowX: "auto"
                    }}>
                      {['All', 'Packaging', 'Fertilizer', 'Equipment'].map(tab => (
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
                      <button className="btn-ghost" style={{ background: "var(--color-bg)", borderRadius: "var(--radius-full)", padding: "4px 16px" }}>Active</button>
                      <button className="btn-ghost" style={{ background: "var(--color-bg)", borderRadius: "var(--radius-full)", padding: "4px 16px" }}>Under review</button>
                    </div>

                    {/* Table */}
                    <div className="table-responsive" style={{ minHeight: "300px" }}>
                      <table className="table-modern">
                        <thead>
                          <tr>
                            <th>COMPANY NAME</th>
                            <th>CATEGORIES</th>
                            <th>PRIMARY CONTACT</th>
                            <th>STATUS</th>
                            <th>MANAGE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {suppliers.map(sup => (
                            <tr key={sup.id} style={{ 
                              cursor: "pointer", 
                              background: selectedSupplierId === sup.id ? "var(--color-hover-green)" : "transparent"
                            }} onClick={() => setSelectedSupplierId(sup.id)}>
                              <td style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)" }}>
                                  {sup.initials}
                                </div>
                                <div style={{ fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)", fontSize: "var(--fs-sm)" }}>
                                  {sup.name}
                                </div>
                              </td>
                              <td>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                  {sup.categories.map(cat => (
                                    <span key={cat} className="badge-info" style={{ fontSize: "9px" }}>
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <div style={{ fontWeight: "var(--fw-medium)", color: "var(--color-text-primary)", fontSize: "var(--fs-sm)" }}>{sup.contactName}</div>
                                <div style={{ color: "var(--color-text-muted)", fontSize: "10px" }}>{sup.contactEmail}</div>
                              </td>
                              <td>
                                <span className="badge-info" style={{ fontSize: "10px", background: "var(--color-card)" }}>
                                  {sup.status}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setActiveModal('edit'); }}
                                    className="btn-ghost"
                                    style={{ padding: "2px 8px", fontSize: "10px", fontWeight: "var(--fw-bold)" }}>
                                    EDIT
                                  </button>
                                  <button className="btn-ghost" style={{ padding: "2px 8px", fontSize: "10px", fontWeight: "var(--fw-bold)", color: "var(--color-text-muted)" }}>
                                    DELETE
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Floating Add Supplier Button */}
                    <div style={{ position: "absolute", bottom: "-20px", right: "var(--space-6)" }}>
                      <button 
                        className="btn-primary" 
                        onClick={() => setActiveModal('add')}
                        style={{ padding: "var(--space-3) var(--space-5)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-hover)" }}>
                        <Plus size={20} />
                        <span style={{ textAlign: "left" }}>Add<br/>Supplier</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Area (Sidebar Details Panel) */}
                <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                  
                  <div className="card" style={{ background: "var(--color-bg)" }}>
                    <div className="flex-between" style={{ marginBottom: "var(--space-2)" }}>
                      <span style={{ fontSize: "10px", fontWeight: "var(--fw-bold)", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                        SUPPLIER ID: {selectedSupplier.details.idStr}
                      </span>
                      <div style={{ display: "flex", gap: "var(--space-4)" }}>
                        <Trash2 size={16} color="var(--color-text-primary)" style={{ cursor: "pointer" }} />
                        <Edit2 size={16} color="var(--color-text-primary)" style={{ cursor: "pointer" }} onClick={() => setActiveModal('edit')} />
                      </div>
                    </div>

                    <h2 style={{ fontSize: "var(--fs-xl)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-2)" }}>
                      {selectedSupplier.name}
                    </h2>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-text-primary)", fontSize: "var(--fs-sm)", marginBottom: "var(--space-6)", fontWeight: "var(--fw-medium)" }}>
                      <MapPin size={16} />
                      <span>{selectedSupplier.details.location}</span>
                    </div>

                    <div style={{ marginBottom: "var(--space-6)" }}>
                      <h3 style={{ fontSize: "10px", fontWeight: "var(--fw-bold)", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "var(--space-3)" }}>CONTACT INFORMATION</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", background: "var(--color-card)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                          <Phone size={14} color="var(--color-text-primary)" />
                          <span style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-medium)", color: "var(--color-text-primary)" }}>{selectedSupplier.details.phone}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", background: "var(--color-card)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                          <Mail size={14} color="var(--color-text-primary)" />
                          <span style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-medium)", color: "var(--color-text-primary)" }}>{selectedSupplier.contactEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 style={{ fontSize: "10px", fontWeight: "var(--fw-bold)", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "var(--space-4)" }}>RECENT ACTIVITY</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                        {selectedSupplier.details.activity.map((act, i) => (
                          <div key={i} style={{ display: "flex", gap: "var(--space-3)" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-hover-green)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <act.icon size={14} color="var(--color-text-primary)" />
                            </div>
                            <div>
                              <div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", color: "var(--color-text-primary)" }}>{act.title}</div>
                              <div style={{ fontSize: "10px", color: "var(--color-text-muted)" }}>{act.subtitle}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      {/* Modal Dialog */}
      {activeModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", 
          background: "rgba(0,0,0,0.5)", zIndex: "var(--z-modal-backdrop)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "var(--space-4)"
        }}>
          <div className="card" style={{ width: "100%", maxWidth: "600px", padding: 0, overflow: "hidden" }}>
            
            <div style={{ padding: "var(--space-6)" }}>
              <div className="flex-between" style={{ marginBottom: "var(--space-6)" }}>
                <h3 style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)" }}>
                  {activeModal === 'add' ? 'Add New Supplier' : 'Edit Supplier Details'}
                </h3>
                <button className="btn-icon" onClick={() => setActiveModal(null)}><X size={18} /></button>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Company Name</label>
                  <input type="text" className="input-primary" defaultValue={activeModal === 'edit' ? selectedSupplier.name : ''} placeholder="e.g. Acme Corp" />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Categories (comma separated)</label>
                  <input type="text" className="input-primary" defaultValue={activeModal === 'edit' ? selectedSupplier.categories.join(', ') : ''} placeholder="e.g. FERTILIZER, PACKAGING" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Contact Name</label>
                    <input type="text" className="input-primary" defaultValue={activeModal === 'edit' ? selectedSupplier.contactName : ''} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Phone Number</label>
                    <input type="text" className="input-primary" defaultValue={activeModal === 'edit' ? selectedSupplier.details.phone : ''} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Email Address</label>
                  <input type="email" className="input-primary" defaultValue={activeModal === 'edit' ? selectedSupplier.contactEmail : ''} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Location</label>
                  <input type="text" className="input-primary" defaultValue={activeModal === 'edit' ? selectedSupplier.details.location : ''} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-4)", marginTop: "var(--space-6)" }}>
                <button type="button" className="btn-ghost" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="button" className="btn-primary" style={{ background: "black" }} onClick={() => setActiveModal(null)}>
                  Save Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SupplierManagement;