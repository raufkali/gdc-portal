import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";

// ----- Public Components -----
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

// ----- Pages -----
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import Departments from "./pages/Departments";
import DepartmentDetail from "./pages/DepartmentDetail";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";

// ----- Additional Pages -----
import Media from "./pages/Media";
import Announcements from "./pages/Announcements";
import AnnouncementDetail from "./pages/AnnouncementDetail";
import ExamResult from "./pages/ExamResult";
import FeeStructure from "./pages/FeeStructure";
import EligibilityCriteria from "./pages/EligibilityCriteria";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import AINavigator from "./components/AINavigator";
// ----- Admin -----
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import ContentManager from "./components/admin/ContentManager";
import SettingsManager from "./components/admin/SettingsManager";

// ===== Scroll to Top Component =====
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

// ===== Navigation Layout (hides navbar on admin routes) =====
function NavigationLayout() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/admin/login" ||
    location.pathname.startsWith("/admin");
  return <>{!isAdminRoute && <Navbar />}</>;
}

// ===== Footer Layout (hides footer on admin routes) =====
function FooterLayout() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/admin/login" ||
    location.pathname.startsWith("/admin");
  return <>{!isAdminRoute && <Footer />}</>;
}

// ===== Main App =====
function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="d-flex flex-column min-vh-100">
            <NavigationLayout />
            <main className="flex-grow-1">
              <Routes>
                {/* ===== Main Pages ===== */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* ===== Programs ===== */}
                <Route path="/programs" element={<Programs />} />
                <Route path="/programs/:slug" element={<ProgramDetail />} />

                {/* ===== Departments ===== */}
                <Route path="/departments" element={<Departments />} />
                <Route
                  path="/departments/:slug"
                  element={<DepartmentDetail />}
                />

                {/* ===== Activities ===== */}
                <Route path="/activities" element={<Activities />} />
                <Route path="/activities/:slug" element={<ActivityDetail />} />

                {/* ===== Gallery & Media ===== */}
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/media" element={<Media />} />

                {/* ===== Testimonials ===== */}
                <Route path="/testimonials" element={<Testimonials />} />

                {/* ===== Announcements ===== */}
                <Route path="/announcements" element={<Announcements />} />
                <Route
                  path="/announcements/:slug"
                  element={<AnnouncementDetail />}
                />

                {/* ===== Admissions ===== */}
                <Route
                  path="/eligibility-criteria"
                  element={<EligibilityCriteria />}
                />
                {/* <Route path="/fee-structure" element={<FeeStructure />} /> */}
                <Route path="/exam-result" element={<ExamResult />} />

                {/* ===== Information ===== */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/faq" element={<FAQ />} />

                {/* ===== Admin Login (public) ===== */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* ===== Protected Admin Area with nested routes ===== */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={
                      <div className="p-4">
                        <h3>Welcome to the Admin Dashboard!</h3>
                        <p className="text-muted">
                          Select an option from the sidebar to manage content.
                        </p>
                      </div>
                    }
                  />
                  <Route path="content" element={<ContentManager />} />
                  <Route path="settings" element={<SettingsManager />} />
                  <Route
                    path="*"
                    element={
                      <div className="p-4 text-center">
                        Page not found in admin
                      </div>
                    }
                  />
                </Route>

                {/* ===== 404 Fallback ===== */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <FooterLayout />
            <AINavigator />
          </div>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
