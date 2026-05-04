import React, { useEffect, useState } from "react";
import API from "../api/client";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [tagForm, setTagForm] = useState({ name: "" });

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingTagId, setEditingTagId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [categoriesRes, tagsRes] = await Promise.all([
        API.get("/categories/"),
        API.get("/tags/")
      ]);
      setCategories(categoriesRes.data);
      setTags(tagsRes.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les catégories et les tags.");
    } finally {
      setLoading(false);
    }
  }

  function resetCategoryForm() {
    setCategoryForm({ name: "" });
    setEditingCategoryId(null);
  }

  function resetTagForm() {
    setTagForm({ name: "" });
    setEditingTagId(null);
  }

  function handleCategoryChange(e) {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  }

  function handleTagChange(e) {
    setTagForm({ ...tagForm, [e.target.name]: e.target.value });
  }

  function handleEditCategory(category) {
    setEditingCategoryId(category.id);
    setCategoryForm({ name: category.name });
    setMessage("");
    setError("");
  }

  function handleEditTag(tag) {
    setEditingTagId(tag.id);
    setTagForm({ name: tag.name });
    setMessage("");
    setError("");
  }

  async function submitCategory(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingCategoryId) {
        await API.put(`/categories/${editingCategoryId}`, categoryForm);
        setMessage("Catégorie modifiée avec succès.");
      } else {
        await API.post("/categories/", categoryForm);
        setMessage("Catégorie créée avec succès.");
      }
      resetCategoryForm();
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors de l’enregistrement de la catégorie.");
    }
  }

  async function submitTag(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingTagId) {
        await API.put(`/tags/${editingTagId}`, tagForm);
        setMessage("Tag modifié avec succès.");
      } else {
        await API.post("/tags/", tagForm);
        setMessage("Tag créé avec succès.");
      }
      resetTagForm();
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors de l’enregistrement du tag.");
    }
  }

  async function deleteCategory(id) {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cette catégorie ?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await API.delete(`/categories/${id}`);
      setMessage("Catégorie supprimée avec succès.");
      if (editingCategoryId === id) resetCategoryForm();
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors de la suppression de la catégorie.");
    }
  }

  async function deleteTag(id) {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer ce tag ?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await API.delete(`/tags/${id}`);
      setMessage("Tag supprimé avec succès.");
      if (editingTagId === id) resetTagForm();
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors de la suppression du tag.");
    }
  }

  return (
    <div className="page-grid two-columns">
      <div className="card">
        <h2>{editingCategoryId ? "Modifier une catégorie" : "Créer une catégorie"}</h2>

        <form onSubmit={submitCategory} className="form-grid">
          <div className="form-group">
            <label>Nom de la catégorie</label>
            <input
              type="text"
              name="name"
              value={categoryForm.name}
              onChange={handleCategoryChange}
              required
              placeholder="Ex : Réseau"
            />
          </div>

          <div className="form-group">
            <label>&nbsp;</label>
            <div className="status-row">
              <button className="primary-button" type="submit">
                {editingCategoryId ? "Enregistrer" : "Créer la catégorie"}
              </button>
              {editingCategoryId && (
                <button className="secondary-button" type="button" onClick={resetCategoryForm}>
                  Annuler
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>{editingTagId ? "Modifier un tag" : "Créer un tag"}</h2>

        <form onSubmit={submitTag} className="form-grid">
          <div className="form-group">
            <label>Nom du tag</label>
            <input
              type="text"
              name="name"
              value={tagForm.name}
              onChange={handleTagChange}
              required
              placeholder="Ex : urgent"
            />
          </div>

          <div className="form-group">
            <label>&nbsp;</label>
            <div className="status-row">
              <button className="primary-button" type="submit">
                {editingTagId ? "Enregistrer" : "Créer le tag"}
              </button>
              {editingTagId && (
                <button className="secondary-button" type="button" onClick={resetTagForm}>
                  Annuler
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {message && <div className="card full-width message-success">{message}</div>}
      {error && <div className="card full-width message-error">{error}</div>}

      <div className="card">
        <h2>Liste des catégories</h2>

        {loading ? (
          <p className="info-text">Chargement des catégories...</p>
        ) : categories.length === 0 ? (
          <p className="info-text">Aucune catégorie trouvée.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>#{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                      <div className="status-row">
                        <button className="secondary-button" type="button" onClick={() => handleEditCategory(category)}>
                          Modifier
                        </button>
                        <button className="danger-button" type="button" onClick={() => deleteCategory(category.id)}>
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

      <div className="card">
        <h2>Liste des tags</h2>

        {loading ? (
          <p className="info-text">Chargement des tags...</p>
        ) : tags.length === 0 ? (
          <p className="info-text">Aucun tag trouvé.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag) => (
                  <tr key={tag.id}>
                    <td>#{tag.id}</td>
                    <td>{tag.name}</td>
                    <td>
                      <div className="status-row">
                        <button className="secondary-button" type="button" onClick={() => handleEditTag(tag)}>
                          Modifier
                        </button>
                        <button className="danger-button" type="button" onClick={() => deleteTag(tag.id)}>
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