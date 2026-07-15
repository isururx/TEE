import React from "react";
import Header from "/src/common components/header.jsx";
import Sidebar from "/src/common components/sidebar.jsx";
import Footer from "/src/common components/footer.jsx";
import { Camera, Upload } from "lucide-react";

const Image = () => {
  return (
    <html data-theme="dark">

      <Header />

      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 65px)",
        }}
      >
        <Sidebar />

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

    </html>
  );
};

export default Image;