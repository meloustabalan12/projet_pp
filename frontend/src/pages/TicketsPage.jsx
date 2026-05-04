import React, { useEffect, useState } from "react";
import API from "../api/client";
import TicketTable from "../components/tickets/TicketTable";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [filtres, setFiltres] = useState({
    status: "",
    priority: "",
    search: ""
  });
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    chargerTickets();
  }, []);

  async function chargerTickets(params = {}) {
    try {
      setChargement(true);
      setErreur("");
      const res = await API.get("/tickets/", { params });
      setTickets(res.data);
    } catch (err) {
      console.error(err);
      setErreur("Impossible de charger les tickets.");
    } finally {
      setChargement(false);
    }
  }

  function gererChangement(e) {
    setFiltres((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function appliquerFiltres() {
    const params = {};
    if (filtres.status) params.status = filtres.status;
    if (filtres.priority) params.priority = filtres.priority;
    if (filtres.search) params.search = filtres.search;
    await chargerTickets(params);
  }

  async function reinitialiserFiltres() {
    const vide = { status: "", priority: "", search: "" };
    setFiltres(vide);
    await chargerTickets();
  }

  return (
    <div className="page-grid">
      <div className="card filter-card">
        <h2>Liste des tickets</h2>
        <div className="filter-row">
          <input
            type="text"
            name="search"
            value={filtres.search}
            onChange={gererChangement}
            placeholder="Rechercher un ticket..."
          />

          <select name="status" value={filtres.status} onChange={gererChangement}>
            <option value="">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="closed">Fermé</option>
          </select>

          <select name="priority" value={filtres.priority} onChange={gererChangement}>
            <option value="">Toutes les priorités</option>
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
          </select>

          <button className="primary-button" onClick={appliquerFiltres}>
            Appliquer
          </button>

          <button className="secondary-button" onClick={reinitialiserFiltres}>
            Réinitialiser
          </button>
        </div>
      </div>

      {chargement ? (
        <div className="card">Chargement des tickets...</div>
      ) : erreur ? (
        <div className="card message-error">{erreur}</div>
      ) : (
        <TicketTable tickets={tickets} />
      )}
    </div>
  );
}