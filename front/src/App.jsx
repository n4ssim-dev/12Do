import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";

import ScrollToTop from "./ScrollToTop.jsx";
import Home from "./pages/home_page/homePage.jsx";
import Error from "./pages/error_page/errorPage.jsx";
import About from "./pages/about_page/about_page.jsx";

// ⚠️ Assure-toi que ces imports existent
import Machines from "./pages/machines_page/machines.jsx";
import Creations from "./pages/creations_page/creations.jsx";
import Formations from "./pages/formations_page/formations.jsx";
import Presta from "./pages/prestations_page/presta.jsx";
import Tutorials from "./pages/tutorials_page/tutorials.jsx";
import Ressources from "./pages/ressources_page/ressources.jsx";

import "./index.scss";

/* ---------------- Page title handler ---------------- */

const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    let title = "12Do";

    switch (location.pathname) {
      case "/":
        title = "Home - 12Do";
        break;
      case "/todos":
        title = "Your Todos - 12Do";
        break;
      case "/todos/create-todo":
        title = "Your Todos - 12Do";
        break;
      case "/todos/modify-todo/":
        title = "Modify Todo - 12Do";
        break;
      case "/about":
        title = "About - 12Do";
        break;
      default:
        title = "12Do";
    }

    document.title = title;
  }, [location.pathname]);

  return null;
};

/* ---------------- App root component ---------------- */

export default function App() {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <PageTitleUpdater />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todos" element={<Machines />} />
        <Route path="/" element={<Creations />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/formations" element={<Formations />} />
        <Route path="/prestations" element={<Presta />} />
        <Route path="/tutoriels" element={<Tutorials />} />
        <Route path="/ressources" element={<Ressources />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}
