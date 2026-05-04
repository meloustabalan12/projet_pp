import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Ticket, FolderKanban, Users, PlusCircle } from "lucide-react";

export default function Sidebar() {
  const linkClass = ({ isActive }) => (isActive ? "nav-item active" : "nav-item");

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-badge">HI</div>
        <div>
          <h2>Helpdesk</h2>
          <p>Intelligent</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={linkClass}>
          <LayoutDashboard size={18} />
          <span>Tableau de bord</span>
        </NavLink>

        <NavLink to="/tickets" className={linkClass}>
          <Ticket size={18} />
          <span>Tickets</span>
        </NavLink>

        <NavLink to="/tickets/new" className={linkClass}>
          <PlusCircle size={18} />
          <span>Nouveau ticket</span>
        </NavLink>

        <NavLink to="/categories" className={linkClass}>
          <FolderKanban size={18} />
          <span>Catégories</span>
        </NavLink>

        <NavLink to="/users" className={linkClass}>
          <Users size={18} />
          <span>Utilisateurs</span>
        </NavLink>
      </nav>
    </aside>
  );
}