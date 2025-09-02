import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Messages from "./pages/Messages";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </div>
  );
}
