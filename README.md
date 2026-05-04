# Helpdesk Intelligent

Application web de gestion de tickets informatiques.

Technologies :

* Backend : FastAPI (Python)
* Frontend : React
* Base de données : PostgreSQL
* Docker

---

# Prérequis

Installer Docker Desktop :

https://www.docker.com/products/docker-desktop/

Vérifier l’installation :

```bash
docker --version
docker compose version
```

---

# Lancer le projet avec Docker Hub (recommandé)

# Télécharger les images

```bash
docker pull diawaramohamed/helpdesk-backend
docker pull diawaramohamed/helpdesk-frontend
docker pull postgres:15
```

---

# Lancer le projet

Depuis le dossier contenant `docker-compose.yml` :

```bash
docker compose down -v
docker compose up
```

---

# Accès à l'application

Frontend :
http://localhost:5173

Backend :
http://localhost:8001

Documentation API :
http://localhost:8001/docs

---

# Base de données

La base est automatiquement initialisée avec :

* 20 utilisateurs
* 10 catégories
* 5 tags
* 21 tickets

  * 11 open
  * 5 in_progress
  * 5 resolved

---

# Important

Ne pas réutiliser :

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

# Commandes utiles

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

# Structure du projet

```
helpdesk-intelligent/
├── backend/
├── frontend/
├── db/
│   └── init.sql
├── docker-compose.yml
```

---

# Remarque

Les catégories utilisées par des tickets ne peuvent pas être supprimées (contrainte de base de données).

---

# Auteurs

Melousta BALAN - 12108306
Issa DIABIRA - 12109303
Mohamed DIAWARA - 12506067
