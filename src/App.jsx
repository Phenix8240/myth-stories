import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import { HomePage, TimelinePage } from "./HomePage";
import MahavidyaPage from "./MahavidyaPage";
import MahavidyaDetailPage from "./MahavidyaDetailPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<TimelinePage />} />
        <Route path="/mahavidya" element={<MahavidyaPage />} />
        <Route path="/mahavidya/:slug" element={<MahavidyaDetailPage />} />
      </Routes>
    </>
  );
}