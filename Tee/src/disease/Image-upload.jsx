import React from "react";
import Header from "../common components/header.jsx";
import RoleSidebar from "../common components/sidebars/RoleSidebar.jsx";
import Footer from "../common components/footer.jsx";
import { Upload } from "lucide-react";

const Image = ({ onNavigate = () => {} }) => {
  return (
    <div>

      <Header />

      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 65px)",
        }}
      >
        <RoleSidebar onNavigate={onNavigate} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <main
            style={{
              flex: 1,
              padding: "40px",
            }}
          >

            <p className="text-gradient"  >Disease Detection</p>
            <div className="card-upload">
              <Upload size={50}/>
              <h1 className="text-gradient">Drag And drop Your Image</h1>
            </div>
          </main>

          <Footer />
        </div>
      </div>

    </div>
  );
};

export default Image;