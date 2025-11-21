import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ProductPage from "./pages/solutions/ProductPage";

// 🏠 Main Pages
import Home from "./pages/Home";
import About from "./components/About";
import Solutions from "./components/Products";
import Industries from "./components/Industries";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./components/BlogDetail";

// 🧩 Apply Page
import Apply from "./pages/Apply";

// 🤖 Solutions Sub Pages
import AIAgent from "./pages/solutions/AIAgent";
import FaceRecognition from "./pages/solutions/FaceRecognition";
import CustomizedDrones from "./pages/solutions/CustomizedDrones";
import AIVirtualAssistant from "./pages/solutions/AIVirtualAssistant";
import InteractiveWebsites from "./pages/solutions/InteractiveWebsites";

// 🏭 Industries Sub Pages
import Hotel from "./pages/industries/Hotel";
import Restaurant from "./pages/industries/Restaurant";
import Supermarket from "./pages/industries/Supermarket";
import ExportImport from "./pages/industries/ExportImport";
import Logistics from "./pages/industries/Logistics";
import Education from "./pages/industries/Education";
import RealEstate from "./pages/industries/RealEstate";
import Finance from "./pages/industries/Finance";
import HR from "./pages/industries/HR";
import Sports from "./pages/industries/Sports";

// 🧩 Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import AssistantWidget from "./components/AssistantWidget";

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />

      <Routes>
        {/* Main Pages */}
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />

        {/* Apply Page */}
        <Route path="/apply/:id" element={<Apply />} />

        {/* Solutions Sub Pages */}
        <Route path="/solutions/1" element={<AIAgent />} />
        <Route path="/solutions/2" element={<FaceRecognition />} />
        <Route path="/solutions/3" element={<CustomizedDrones />} />
        <Route path="/solutions/4" element={<AIVirtualAssistant />} />
        <Route path="/solutions/5" element={<InteractiveWebsites />} />

        {/* Industries Sub Pages */}
        <Route path="/industries/hotel" element={<Hotel />} />
        <Route path="/industries/restaurant" element={<Restaurant />} />
        <Route path="/industries/supermarket" element={<Supermarket />} />
        <Route path="/industries/export-import" element={<ExportImport />} />
        <Route path="/industries/logistics" element={<Logistics />} />
        <Route path="/industries/education" element={<Education />} />
        <Route path="/industries/realestate" element={<RealEstate />} />
        <Route path="/industries/finance" element={<Finance />} />
        <Route path="/industries/hr" element={<HR />} />
        <Route path="/industries/sports" element={<Sports />} />

        {/* Catch-All */}
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
      <AssistantWidget />
    </>
  );
}

export default App;