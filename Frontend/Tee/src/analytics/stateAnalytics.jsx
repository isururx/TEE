import React, { useState, useMemo } from "react";

import Header from "../common components/header.jsx";
import Sidebar from "../common components/sidebar.jsx";
import Footer from "../common components/footer.jsx";

import SectorCard from "./sectorCard";
import Pagination from "./pagination";
import SectorDetailPanel from "./sectorDetailPanel";

const TEA_VARIETIES = ["Assamica CL12", "Sinensis TRI 2025", "Assamica CL16", "Sinensis DT1"];

// Generate 93 mock sector blocks
function generateSectors(count) {
  const letters = ["A", "B", "C", "D"];
  const sectors = [];
  for (let i = 0; i < count; i++) {
    const letter = letters[i % letters.length];
    const num = String(((i * 7) % 99) + 1).padStart(2, "0");
    const health = 58 + ((i * 13) % 41); // Health percentage between 58% and 98%
    sectors.push({
      id: i,
      name: `Sector ${letter}${num}`,
      teaVariety: TEA_VARIETIES[i % TEA_VARIETIES.length],
      areaSize: `${(10 + ((i * 3) % 20) + Math.round(Math.random() * 10) / 10).toFixed(1)} Hectares`,
      health,
    });
  }
  return sectors;
}

const ITEMS_PER_PAGE = 20;
const ALL_SECTORS = generateSectors(93);

export default function StateAnalytics({ onNavigate = () => {} }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSector, setSelectedSector] = useState(ALL_SECTORS[0]);

  const totalPages = Math.ceil(ALL_SECTORS.length / ITEMS_PER_PAGE);

  const visibleSectors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return ALL_SECTORS.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar activeItem="analytics" onNavigate={onNavigate} />

        <main className="p-card" style={{ flex: 1 }}>
          <h1 className="page-title" style={{ fontSize: "var(--fs-3xl)", marginBottom: "var(--space-6)" }}>
            State Analytics
          </h1>

          <div className="gap-lg" style={{ display: "flex", alignItems: "flex-start" }}>
            {/* Grid + pagination */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: "var(--space-4)" }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={ALL_SECTORS.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </div>

              <div className="grid-auto-fit">
                {visibleSectors.map((sector) => (
                  <SectorCard
                    key={sector.id}
                    name={sector.name}
                    selected={selectedSector?.id === sector.id}
                    onClick={() => setSelectedSector(sector)}
                  />
                ))}
              </div>
            </div>

            {/* Detail panel */}
            <SectorDetailPanel
              sector={selectedSector}
              onClose={() => setSelectedSector(null)}
            />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}