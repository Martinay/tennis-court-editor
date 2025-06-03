import { Routes, Route } from "react-router-dom";
import { FacilityProvider } from "./store/FacilityContext";
import Home from "./pages/Home";
import Facility from "./pages/Facility";

export default function App() {
  return (
    <FacilityProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/facility/:id" element={<Facility />} />
      </Routes>
    </FacilityProvider>
  );
}