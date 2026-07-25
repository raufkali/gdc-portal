// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Layout Components
import Navbar from "./page/Navbar";

// Main Page Components
import Homepage from "./page/Homepage";
import PrivacyPolicy from "./page/PrivacyPolicy";
import Aboutcolleg from "./page/Aboutcolleg";
import AdminPanel from "./page/AdminPanel";
import Login from "./components/admin/AdminLogin";

// Admission & Info Components
import EligibilityCriteria from "./components/EligibilityCriteria";
import FeeStructure from "./components/FeeStructure";
import OnlineAdmission from "./components/OnlineAdmission";
import OfferedProgram from "./components/OfferedProgram";
import Announcements from "./components/Announcements";
import Contact from "./components/Contact";
import Media from "./components/Media";
import ExamResult from "./page/ExamResult";

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

// Secondary component helper
function NavigationLayout() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/gdc-admin-portal" || location.pathname === "/login";
  return <>{!isAdminRoute && <Navbar />}</>;
}

function App() {
  return (
    <Router>
      <NavigationLayout />
      <main style={{ minHeight: "80vh" }}>
        <Routes>
          {/* Core Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about-colleg" element={<Aboutcolleg />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Admin Routes */}
          <Route path="/gdc-admin-portal" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />

          {/* Admission & Info */}
          <Route
            path="/eligibility-criteria"
            element={<EligibilityCriteria />}
          />
          <Route path="/fee-structure" element={<FeeStructure />} />
          <Route path="/online-admission" element={<OnlineAdmission />} />
          <Route path="/offered-program" element={<OfferedProgram />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/media" element={<Media />} />
          <Route path="/exam-reslut" element={<ExamResult />} />

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
        </Routes>
      </main>
    </Router>
  );
}

export default App;
