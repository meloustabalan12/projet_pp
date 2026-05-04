import React, { useEffect, useState } from "react";
import API from "../api/client";

export default function NewTicketPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    owner_id: "",
    category_id: "",
    tag_ids: []
  });

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [usersRes, categoriesRes, tagsRes] = await Promise.all([
        API.get("/users/"),
        API.get("/categories/"),
        API.get("/tags/")
      ]);

      setUsers(usersRes.data);
      setCategories(categoriesRes.data);
      setTags(tagsRes.data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des données.");
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleTagChange(tagId) {
    setForm((prev) => {
      const exists = prev.tag_ids.includes(tagId);
      return {
        ...prev,
        tag_ids: exists
          ? prev.tag_ids.filter((id) => id !== tagId)
          : [...prev.tag_ids, tagId]
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await API.post("/tickets/", {
        ...form,
        owner_id: Number(form.owner_id),
        category_id: Number(form.category_id)
      });

      setMessage("Ticket créé avec succès !");
      setForm({
        title: "",
        description: "",
        owner_id: "",
        category_id: "",
        tag_ids: []
      });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création du ticket.");
    }
  }

  return (
    <div className="page-grid">
      <div className="page-header">
        <h2>Nouveau ticket</h2>
        <p>Créer une nouvelle demande d’assistance</p>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full">
            <label>Titre</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Utilisateur</label>
            <select
              name="owner_id"
              value={form.owner_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Catégorie</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full">
            <label>Tags</label>
            <div className="checkbox-grid">
              {tags.map((tag) => (
                <label key={tag.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={form.tag_ids.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button className="primary-button">Créer le ticket</button>

        {message && <p className="form-message message-success">{message}</p>}
        {error && <p className="form-message message-error">{error}</p>}
      </form>
    </div>
  );
}