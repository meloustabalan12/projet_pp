import React, { useEffect, useState } from "react";
import API from "../api/client";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    role: "client"
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/users/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      full_name: "",
      email: "",
      role: "client"
    });
    setEditingId(null);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setForm({
      full_name: user.full_name,
      email: user.email,
      role: user.role
    });
    setMessage("");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await API.put(`/users/${editingId}`, form);
        setMessage("Utilisateur modifié avec succès.");
      } else {
        await API.post("/users/", form);
        setMessage("Utilisateur créé avec succès.");
      }

      resetForm();
      await loadUsers();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Erreur lors de l’enregistrement de l’utilisateur."
      );
    }
  }

  async function handleDelete(userId) {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await API.delete(`/users/${userId}`);
      setMessage("Utilisateur supprimé avec succès.");

      if (editingId === userId) {
        resetForm();
      }

      await loadUsers();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Erreur lors de la suppression de l’utilisateur."
      );
    }
  }

  function translateRole(role) {
    switch (role) {
      case "client":
        return "Client";
      case "technician":
        return "Technicien";
      case "admin":
        return "Administrateur";
      default:
        return role;
    }
  }

  return (
    <div className="page-grid two-columns">
      <div className="card">
        <h2>{editingId ? "Modifier un utilisateur" : "Créer un utilisateur"}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              placeholder="Ex : Jean Dupont"
            />
          </div>

          <div className="form-group">
            <label>Adresse e-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Ex : jean@example.com"
            />
          </div>

          <div className="form-group">
            <label>Rôle</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="client">Client</option>
              <option value="technician">Technicien</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div className="form-group">
            <label>&nbsp;</label>
            <div className="status-row">
              <button className="primary-button" type="submit">
                {editingId ? "Enregistrer les modifications" : "Créer l’utilisateur"}
              </button>

              {editingId && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={resetForm}
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        </form>

        {message && <p className="form-message message-success">{message}</p>}
        {error && <p className="form-message message-error">{error}</p>}
      </div>

      <div className="card">
        <h2>Liste des utilisateurs</h2>

        {loading ? (
          <p className="info-text">Chargement des utilisateurs...</p>
        ) : users.length === 0 ? (
          <p className="info-text">Aucun utilisateur trouvé.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>E-mail</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{translateRole(user.role)}</td>
                    <td>
                      <div className="status-row">
                        <button
                          className="secondary-button"
                          type="button"
                          onClick={() => handleEdit(user)}
                        >
                          Modifier
                        </button>
                        <button
                          className="danger-button"
                          type="button"
                          onClick={() => handleDelete(user.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}