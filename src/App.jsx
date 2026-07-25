// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./page/Navbar";
import Footer from "./page/Footer";
import Homepage from "./page/Homepage";
import AboutCollege from "./page/AboutCollege";
import Contact from "./components/Contact";
import Announcements from "./components/Announcements";
import Media from "./components/Media";
import ExamResult from "./page/ExamResult";
import AdminPanel from "./admin/Dashboard";
import DepartmentPage from "./components/DepartmentPage";
import DepartmentList from "./components/DepartmentList";
import EligibilityCriteria from "./components/EligibilityCriteria";
import OfferedProgram from "./components/OfferedProgram";
import PrivacyPolicy from "./page/PrivacyPolicy";
import CollegeFaq from "./page/CollegeFaq";

function NavigationLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname === "/gdc-admin-portal";
  return <>{!isAdminRoute && <Navbar />}</>;
}

function App() {
  return (
    <Router>
      <NavigationLayout />
      <main style={{ minHeight: "80vh" }}>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about-college" element={<AboutCollege />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<CollegeFaq />} />

          {/* Announcements & Media */}
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/media" element={<Media />} />
          <Route path="/exam-result" element={<ExamResult />} />

          {/* Admissions */}
          <Route
            path="/eligibility-criteria"
            element={<EligibilityCriteria />}
          />
          <Route path="/offered-program" element={<OfferedProgram />} />

          {/* Departments */}
          <Route path="/department/:id" element={<DepartmentPage />} />
          <Route path="/departments" element={<DepartmentList />} />

          {/* Admin */}
          <Route path="/gdc-admin-portal" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
