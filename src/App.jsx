import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
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
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/programs/:slug" element={<ProgramDetail />} />
                <Route path="/departments" element={<Departments />} />
                <Route
                  path="/departments/:slug"
                  element={<DepartmentDetail />}
                />
                <Route path="/activities" element={<Activities />} />
                <Route path="/activities/:slug" element={<ActivityDetail />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
export default App;
