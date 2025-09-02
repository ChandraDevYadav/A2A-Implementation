import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold text-xl">A2A Dashboard</h1>
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/agents" className="hover:underline">
          Agents
        </Link>
        <Link to="/messages" className="hover:underline">
          Messages
        </Link>
      </nav>
    </header>
  );
}
