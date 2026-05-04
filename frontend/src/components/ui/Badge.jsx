import React from "react";

function traduireStatut(status) {
  switch (status) {
    case "open":
      return "Ouvert";
    case "in_progress":
      return "En cours";
    case "resolved":
      return "Résolu";
    case "closed":
      return "Fermé";
    default:
      return status;
  }
}

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

export default function Badge({ type, value }) {
  const texte =
    ["open", "in_progress", "resolved", "closed"].includes(value)
      ? traduireStatut(value)
      : traduirePriorite(value);

  return <span className={`badge ${type}`}>{texte}</span>;
}