import React, { useEffect, useState } from "react";
import API from "../api/client";

function traduirePriorite(priority) {
  switch (priority) {
    case "low":
      return "Faible";
    case "medium":
      return "Moyenne";
    case "high":
      return "Élevée";
    default:
      return priority;
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    high_priority: 0
  });
  const [ticketsRecents, setTicketsRecents] = useState([]);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    chargerDashboard();
  }, []);

  async function chargerDashboard() {
    try {
      setErreur("");
      const [statsRes, ticketsRes] = await Promise.all([
        API.get("/tickets/stats/overview"),
        API.get("/tickets/")
      ]);

      setStats(statsRes.data);
      setTicketsRecents(ticketsRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
      setErreur("Impossible de charger le tableau de bord.");
    }
  }

  return (
    <div className="page-grid">
      {erreur && <div className="card message-error">{erreur}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total des tickets</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Tickets ouverts</h3>
          <p>{stats.open}</p>
        </div>
        <div className="stat-card">
          <h3>En cours</h3>
          <p>{stats.in_progress}</p>
        </div>
        <div className="stat-card">
          <h3>Résolus</h3>
          <p>{stats.resolved}</p>
        </div>
      </div>

      <div className="card">
        <h2>Tickets récents</h2>
        <div className="recent-list">
          {ticketsRecents.length === 0 ? (
            <p className="info-text">Aucun ticket pour le moment.</p>
          ) : (
            ticketsRecents.map((ticket) => (
              <div className="recent-item" key={ticket.id}>
                <div>
                  <strong>{ticket.title}</strong>
                  <p>
                    {ticket.category?.name || "Sans catégorie"} • {ticket.owner?.full_name || "Utilisateur inconnu"}
                  </p>
                </div>
                <span className={`mini-badge ${ticket.priority || "medium"}`}>
                  {traduirePriorite(ticket.priority || "medium")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}