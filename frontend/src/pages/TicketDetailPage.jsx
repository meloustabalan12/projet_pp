import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/client";
import Badge from "../components/ui/Badge";

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [resolution, setResolution] = useState({
    content: "",
    solved_by: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTicket();
  }, [id]);

  async function loadTicket() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/tickets/${id}`);
      setTicket(res.data);
      setStatus(res.data.status);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger le ticket.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus() {
    try {
      setMessage("");
      setError("");
      await API.patch(`/tickets/${id}/status`, { status });
      setMessage("Statut mis à jour avec succès.");
      await loadTicket();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors de la mise à jour du statut.");
    }
  }

  async function addResolution(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      await API.post(`/tickets/${id}/resolution`, resolution);
      setMessage("Résolution ajoutée avec succès.");
      setResolution({
        content: "",
        solved_by: ""
      });
      await loadTicket();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors de l’ajout de la résolution.");
    }
  }

  async function deleteTicket() {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer ce ticket ?");
    if (!confirmed) return;

    try {
      await API.delete(`/tickets/${id}`);
      navigate("/tickets");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors de la suppression du ticket.");
    }
  }

  function handleResolutionChange(e) {
    setResolution((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  if (loading) {
    return <div className="card">Chargement du ticket...</div>;
  }

  if (error && !ticket) {
    return <div className="card message-error">{error}</div>;
  }

  return (
    <div className="page-grid">
      {message && <div className="card message-success">{message}</div>}
      {error && ticket && <div className="card message-error">{error}</div>}

      <div className="card">
        <div className="status-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>{ticket.title}</h2>
          <button className="danger-button" type="button" onClick={deleteTicket}>
            Supprimer le ticket
          </button>
        </div>

        <p className="info-text">{ticket.description}</p>

        <div className="detail-grid">
          <div><strong>ID :</strong> {ticket.id}</div>
          <div><strong>Statut :</strong> <Badge type={ticket.status} value={ticket.status} /></div>
          <div><strong>Priorité :</strong> <Badge type={ticket.priority} value={ticket.priority} /></div>
          <div><strong>Catégorie :</strong> {ticket.category?.name || "-"}</div>
          <div><strong>Utilisateur :</strong> {ticket.owner?.full_name || "-"}</div>
          <div><strong>Catégorie suggérée :</strong> {ticket.suggested_category || "Aucune"}</div>
          <div className="full"><strong>Indice intelligent :</strong> {ticket.ai_hint || "Aucun"}</div>
          <div className="full">
            <strong>Tags :</strong>{" "}
            {ticket.tags && ticket.tags.length > 0
              ? ticket.tags.map((tag) => tag.name).join(", ")
              : "Aucun tag"}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Mettre à jour le statut</h3>

        <div className="status-row">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="closed">Fermé</option>
          </select>

          <button className="primary-button" onClick={updateStatus}>
            Enregistrer le statut
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Résolution</h3>

        {ticket.resolution ? (
          <div className="resolution-box">
            <p><strong>Résolu par :</strong> {ticket.resolution.solved_by}</p>
            <p>{ticket.resolution.content}</p>
          </div>
        ) : (
          <form onSubmit={addResolution} className="form-grid">
            <div className="form-group">
              <label>Nom du technicien</label>
              <input
                type="text"
                name="solved_by"
                value={resolution.solved_by}
                onChange={handleResolutionChange}
                required
                placeholder="Ex : Karim Benali"
              />
            </div>

            <div className="form-group full">
              <label>Contenu de la résolution</label>
              <textarea
                name="content"
                rows="4"
                value={resolution.content}
                onChange={handleResolutionChange}
                required
                placeholder="Décris la solution appliquée..."
              />
            </div>

            <button className="primary-button" type="submit">
              Ajouter la résolution
            </button>
          </form>
        )}
      </div>
    </div>
  );
}