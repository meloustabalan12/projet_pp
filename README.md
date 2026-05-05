# Helpdesk Intelligent

Application web de gestion de tickets informatiques.

---

## Contexte du projet

Cette application permet de gérer les incidents informatiques au sein d’une organisation.
Les utilisateurs peuvent créer des tickets (problèmes réseau, matériel, logiciel, etc.), et les techniciens peuvent les suivre, les traiter et les résoudre.

L’objectif est de centraliser la gestion du support informatique et d’améliorer le suivi des incidents.

---

## Fonctionnalités

L’application permet :

* Créer un ticket
* Modifier un ticket
* Supprimer un ticket
* Changer le statut d’un ticket (open, in_progress, resolved)
* Ajouter une résolution à un ticket
* Consulter les statistiques (dashboard)
* Gérer les utilisateurs
* Gérer les catégories
* Gérer les tags

---

## Fonctionnalité intelligente

Une logique simple d’analyse est intégrée au backend.

Lors de la création d’un ticket, le système peut :

* suggérer une catégorie
* proposer une priorité
* fournir un indice de résolution (ai_hint)

Cette fonctionnalité repose sur une analyse de mots-clés dans la description du ticket et permet d’aider les techniciens à traiter plus rapidement les incidents.

---

## Technologies

* Backend : FastAPI (Python)
* Frontend : React (Vite)
* Base de données : PostgreSQL
* Docker : orchestration des services

---

## Architecture du projet

L’application est organisée en trois parties :

* Frontend (React) : interface utilisateur
* Backend (FastAPI) : API REST
* Base de données (PostgreSQL) : stockage des données

### Flux de fonctionnement :

```
Frontend → Backend → Base de données
```

Le frontend envoie des requêtes HTTP au backend, qui interagit avec la base de données.

---

## Relations de base de données

Le projet respecte les relations suivantes :

* One-to-One : un ticket possède une résolution
* One-to-Many : une catégorie possède plusieurs tickets
* Many-to-Many : un ticket peut avoir plusieurs tags

---

## Prérequis

Installer Docker Desktop :

https://www.docker.com/products/docker-desktop/

Vérifier l’installation :

```bash
docker --version
docker compose version
```

---

## Lancer le projet avec Docker Hub (recommandé)

### 1. Télécharger les images

```bash
docker pull diawaramohamed/helpdesk-backend
docker pull diawaramohamed/helpdesk-frontend
docker pull postgres:15
```

---

### 2. Lancer le projet

Depuis le dossier contenant `docker-compose.yml` :

```bash
docker compose down -v
docker compose up
```

---

## Accès à l'application

Frontend :
http://localhost:5173

Backend :
http://localhost:8001

Documentation API (Swagger) :
http://localhost:8001/docs

---

## Utilisation

1. Accéder au frontend
2. Créer un ticket
3. Suivre son statut
4. Ajouter une résolution
5. Consulter les statistiques

---

## Exemples de routes API

### Récupérer tous les tickets

```
GET /tickets
```

### Statistiques des tickets

```
GET /tickets/stats/overview
```

Exemple de réponse :

```json
{
  "total": 21,
  "open": 11,
  "in_progress": 5,
  "resolved": 5
}
```

### Créer un ticket

```
POST /tickets
```

### Supprimer un ticket

```
DELETE /tickets/{id}
```

---

## Base de données

La base est automatiquement initialisée avec :

* 20 utilisateurs
* 10 catégories
* 5 tags
* 21 tickets

  * 11 open
  * 5 in_progress
  * 5 resolved

### Exemple de données

Utilisateur :

* Jean Dupont (client)

Ticket :

* Titre : Connexion internet coupée
* Statut : open
* Priorité : high

---

## Important

Ne pas utiliser :

```bash
docker compose down -v
```

Cette commande supprime toutes les données.

Utiliser :

```bash
docker compose down
docker compose up
```

pour conserver les données.

---

## Commandes utiles

Voir les conteneurs :

```bash
docker compose ps
```

Voir les logs :

```bash
docker compose logs -f
```

Redémarrer :

```bash
docker compose restart
```

---

## Lancer sans Docker (optionnel)

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Tests

Des tests peuvent être exécutés pour vérifier certains endpoints du backend :

```bash
cd backend
pytest
```

---

## Structure du projet

```
helpdesk-intelligent/
├── backend/       # API FastAPI
├── frontend/      # Interface React
├── db/
│   └── init.sql   # Données initiales
├── docker-compose.yml
```

---

## Limites du projet

* Authentification non implémentée
* Gestion des rôles simplifiée
* Fonction intelligente basée sur des règles simples
* Projet réalisé dans un cadre pédagogique

---

## Remarque

Les catégories utilisées par des tickets ne peuvent pas être supprimées (contrainte de base de données).

---

## Auteurs

Melousta BALAN - 12108306
Issa DIABIRA - 12109303
Mohamed Drissa DIAWARA - 12506067
