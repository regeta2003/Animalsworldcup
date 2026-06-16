import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "@/pages/Home";
import Teams from "@/pages/Teams";
import Table from "@/pages/Table";
import Schedule from "@/pages/Schedule";
import Statistics from "@/pages/Statistics";
import Live from "@/pages/Live";
import News from "@/pages/News";
import Article from "@/pages/Article";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/table" element={<Table />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/live" element={<Live />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<Article />} />
      <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
