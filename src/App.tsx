import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// 🏠 Core layout components — always needed, NOT lazy (they render on every page)
import Header from "./components/Header";
import Footer from "./components/Footer";
import AssistantWidget from "./components/AssistantWidget";

// 🏠 Main pages — lazy loaded for code-splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./components/About"));
const Solutions = lazy(() => import("./components/Products")); // products listing page
const Industries = lazy(() => import("./components/Industries"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const Apply = lazy(() => import("./pages/Apply"));
const ProductPage = lazy(() => import("./pages/solutions/ProductPage"));

// 🤖 Solutions Sub Pages — lazy loaded
const AIAgent = lazy(() => import("./pages/solutions/AIAgent"));
const FaceRecognition = lazy(() => import("./pages/solutions/FaceRecognition"));
const CustomizedDrones = lazy(() => import("./pages/solutions/CustomizedDrones"));
const AIVirtualAssistant = lazy(() => import("./pages/solutions/AIVirtualAssistant"));
const InteractiveWebsites = lazy(() => import("./pages/solutions/InteractiveWebsites"));

// 🏭 Industries Sub Pages — lazy loaded
const Hotel = lazy(() => import("./pages/industries/Hotel"));
const Restaurant = lazy(() => import("./pages/industries/Restaurant"));
const Supermarket = lazy(() => import("./pages/industries/Supermarket"));
const ExportImport = lazy(() => import("./pages/industries/ExportImport"));
const Logistics = lazy(() => import("./pages/industries/Logistics"));
const Education = lazy(() => import("./pages/industries/Education"));
const RealEstate = lazy(() => import("./pages/industries/RealEstate"));
const Finance = lazy(() => import("./pages/industries/Finance"));
const HR = lazy(() => import("./pages/industries/HR"));
const Sports = lazy(() => import("./pages/industries/Sports"));

// Minimal fallback — no layout shift, matches dark background
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-blue-400/40 border-t-blue-400 rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Main Pages */}
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/industries" element={<Industries />} />
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
      </Suspense>

      <Footer />
      <AssistantWidget />
    </>
  );
}

export default App;