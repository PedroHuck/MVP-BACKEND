import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { token, logout } = useAuth();
  const nav = useNavigate();
  const links = [["/", "Início"], ["/explorar", "Explorar"], [token ? "/admin" : "/login", token ? "Painel" : "Área do admin"]];
  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-display text-xl font-semibold">⛰ Terê Verde</Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map(([to, l]) => <NavLink key={to} to={to} end className={({ isActive }) => isActive ? "font-semibold" : "opacity-70 hover:opacity-100"}>{l}</NavLink>)}
          {token && <button className="btn-ghost" onClick={() => { logout(); nav("/login"); }}>Sair</button>}
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
      </div>
      {open && (
        <nav className="flex flex-col gap-3 px-4 pb-4 md:hidden">
          {links.map(([to, l]) => <Link key={to} to={to} onClick={() => setOpen(false)}>{l}</Link>)}
        </nav>
      )}
    </header>
  );
}
