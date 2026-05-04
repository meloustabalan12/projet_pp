import React from "react";
import { Link } from "react-router-dom";
import Badge from "../ui/Badge";

export default function TicketTable({ tickets }) {
  return (
    <div className="card">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Catégorie</th>
              <th>Utilisateur</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-cell">Aucun ticket</td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.title}</td>
                  <td>
                    <Badge type={ticket.status} value={ticket.status} />
                  </td>
                  <td>
                    <Badge type={ticket.priority} value={ticket.priority} />
                  </td>
                  <td>{ticket.category?.name || "-"}</td>
                  <td>{ticket.owner?.full_name || "-"}</td>
                  <td>
                    <Link className="link-button" to={`/tickets/${ticket.id}`}>
                      Voir
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}