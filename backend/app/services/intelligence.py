def analyze_ticket(title: str, description: str) -> dict:
    text = f"{title} {description}".lower()

    priority = "medium"
    suggested_category = "General Support"
    ai_hint = "Ticket analyzed successfully."

    if any(word in text for word in ["urgent", "bloqué", "bloque", "critical", "critique", "production", "server down", "serveur"]):
        priority = "high"
        ai_hint = "High priority detected because the ticket seems critical."

    elif any(word in text for word in ["lent", "slow", "minor", "question", "information"]):
        priority = "low"
        ai_hint = "Low priority suggested because the ticket appears non-blocking."

    if any(word in text for word in ["password", "login", "connexion", "account", "compte", "auth"]):
        suggested_category = "Access Management"

    elif any(word in text for word in ["printer", "imprimante", "hardware", "pc", "laptop", "écran", "ecran"]):
        suggested_category = "Hardware"

    elif any(word in text for word in ["network", "wifi", "internet", "vpn", "réseau", "reseau"]):
        suggested_category = "Network"

    elif any(word in text for word in ["bug", "application", "app", "logiciel", "software", "crash"]):
        suggested_category = "Software"

    return {
        "priority": priority,
        "suggested_category": suggested_category,
        "ai_hint": ai_hint
    }