import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Layout Components
import Navbar from "./page/Navbar"; 

// Main Page Components
import Homepage from "./page/Homepage";
import PrivacyPolicy from "./page/PrivacyPolicy";
import Aboutcolleg from "./page/Aboutcolleg"; 
import AdminPanel from "./page/AdminPanel"; 

// Admission & Info Components
import EligibilityCriteria from "./components/EligibilityCriteria";
import FeeStructure from "./components/FeeStructure";
import OnlineAdmission from "./components/OnlineAdmission";
import OfferedProgram from "./components/OfferedProgram";
import Announcements from "./components/Announcements";
import Contact from "./components/Contact";
import Media from "./components/Media";
import ExamResult from "./page/ExamResult"; // <-- Imported ExamResult

// Department Components
import Chem from "./components/Chem";
import Phy from "./components/Phy";
import Computer from "./components/Computer";
import Urdu from "./components/Urdu";
import Econom from "./components/Econom";
import Eng from "./components/Eng";
import Islamic from "./components/Islamic";
import Math from "./components/Math";
import Polital from "./components/Polital";
import Zoolog from "./components/Zoolog";


// Secondary component helper to check current location routes inside the active Context Router
function NavigationLayout() {
  const location = useLocation();
  
  // Do not show the navigation header link bar if the administrator is working in the backend view
  const isAdminRoute = location.pathname === "/gdc-admin-portal";

  return (
    <>
      {!isAdminRoute && <Navbar />}
    </>
  );
}

function App() {
  return (
    <Router>
      {/* Dynamic Navigation Rule Engine */}
      <NavigationLayout /> 
      
      {/* Main Content Area */}
      <main style={{ minHeight: "80vh" }}>
        <Routes>
          {/* Core Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about-colleg" element={<Aboutcolleg />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Admission & Info */}
          <Route path="/eligibility-criteria" element={<EligibilityCriteria />} />
          <Route path="/fee-structure" element={<FeeStructure />} />
          <Route path="/online-admission" element={<OnlineAdmission />} />
          <Route path="/offered-program" element={<OfferedProgram />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/media" element={<Media />} />
          <Route path="/exam-reslut" element={<ExamResult />} /> {/* <-- Added Route */}
    
          {/* Academic Departments */}
          <Route path="/chemistry" element={<Chem />} />
          <Route path="/computer-science" element={<Computer />} />
          <Route path="/physics" element={<Phy />} />
          <Route path="/Urdu" element={<Urdu />} />
          <Route path="/Economics" element={<Econom />} />
          <Route path="/english" element={<Eng />} />
          <Route path="/islamic-study" element={<Islamic />} />
          <Route path="/Mathematics" element={<Math />} />
          <Route path="/political-science" element={<Polital />} />
          <Route path="/zoology" element={<Zoolog />} />

          {/* Admin Portal Layout Endpoint */}
          <Route path="/gdc-admin-portal" element={<AdminPanel />} />
        </Routes>
      </main>

      {/* Global Footer Elements go here if needed */}
    </Router>
  );
}

export default App;