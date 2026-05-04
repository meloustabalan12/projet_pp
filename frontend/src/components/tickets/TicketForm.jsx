import { useEffect, useState } from "react";
import API from "../../api/client";

export default function TicketForm() {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "open",
    priority: "",
    owner_id: "",
    category_id: "",
    tag_ids: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [usersRes, categoriesRes, tagsRes] = await Promise.all([
      API.get("/users"),
      API.get("/categories"),
      API.get("/tags")
    ]);

    setUsers(usersRes.data);
    setCategories(categoriesRes.data);
    setTags(tagsRes.data);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

    try {
      const payload = {
        ...form,
        owner_id: Number(form.owner_id),
        category_id: Number(form.category_id),
        priority: form.priority || null
      };

      await API.post("/tickets/", payload);

      setMessage("Ticket créé avec succès.");
      setForm({
        title: "",
        description: "",
        status: "open",
        priority: "",
        owner_id: "",
        category_id: "",
        tag_ids: []
      });
    } catch (error) {
      setMessage(error.response?.data?.detail || "Erreur lors de la création du ticket.");
    }
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group full">
          <label>Titre</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Ex: Problème de connexion VPN"
          />
        </div>

        <div className="form-group full">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Décris le problème rencontré..."
          />
        </div>

        <div className="form-group">
          <label>Utilisateur</label>
          <select name="owner_id" value={form.owner_id} onChange={handleChange} required>
            <option value="">Choisir un utilisateur</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Catégorie</label>
          <select name="category_id" value={form.category_id} onChange={handleChange} required>
            <option value="">Choisir une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Statut</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="open">open</option>
            <option value="in_progress">in_progress</option>
            <option value="resolved">resolved</option>
            <option value="closed">closed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priorité</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="">Automatique</option>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
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

      <button className="primary-button" type="submit">
        Créer le ticket
      </button>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
}