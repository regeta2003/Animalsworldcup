import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Teams from "@/pages/Teams";
import Table from "@/pages/Table";
import Schedule from "@/pages/Schedule";
import Statistics from "@/pages/Statistics";
import Live from "@/pages/Live";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/table" element={<Table />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/live" element={<Live />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
