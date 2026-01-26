import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";

import ScrollToTop from "./ScrollToTop.jsx";
import Home from "./pages/home/HomePage.jsx";
import About from "./pages/about/AboutPage";
import Login from "./pages/auth/LoginPage.jsx";
import Register from "./pages/auth/RegisterPage.jsx";
import Error from "./pages/error/NotFound.jsx"
import Dashboard from "./pages/dashboard/Dashboard.jsx"
import AgendaPage from "./pages/agenda/Agenda.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx"
import { AuthProvider } from "./AuthContext.jsx";

import "./index.scss";

/* ---------------- App root component ---------------- */

export default function App() {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Error />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agenda"
          element={
            <ProtectedRoute>
              <AgendaPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      </AuthProvider>
    </Router>
  );
}
