import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/admin/",          label: "Panel Principal" },
  { path: "/admin/bitacora",  label: "Bitácora" },
  { path: "/admin/usuarios",  label: "Usuarios" },
  { path: "/admin/equipos",   label: "Equipos" },
  { path: "/admin/tareas",    label: "Tareas" },
  { path: "/admin/repuestos", label: "Repuestos" },
  { path: "/admin/preventivo",label: "Preventivo" },
  { path: "/admin/correctivo",label: "Correctivo" },
  { path: "/admin/pirometria",label: "Pirometría" },
];

const AdminMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) =>
    path === "/admin/"
      ? location.pathname === "/admin/"
      : location.pathname.startsWith(path);

  return (
    <nav className="bg-zinc-900 border-b border-zinc-700">
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">
          SisManCT — Admin
        </span>
        {/* Hamburger (mobile) */}
        <button
          className="lg:hidden text-zinc-400 hover:text-orange-400 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(({ path, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide transition-colors ${
                isActive(path)
                  ? "bg-orange-500 text-white"
                  : "text-zinc-400 hover:text-orange-400 hover:bg-zinc-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-zinc-700 px-4 pb-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ path, label }) => (
            <button
              key={path}
              onClick={() => { navigate(path); setOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActive(path)
                  ? "bg-orange-500 text-white"
                  : "text-zinc-400 hover:text-orange-400 hover:bg-zinc-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default AdminMenu;
