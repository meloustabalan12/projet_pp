CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'client'
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'open',
    priority VARCHAR(30) NOT NULL DEFAULT 'medium',
    suggested_category VARCHAR(100),
    ai_hint VARCHAR(255),
    owner_id INTEGER NOT NULL REFERENCES users(id),
    category_id INTEGER NOT NULL REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS ticket_tag (
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (ticket_id, tag_id)
);

CREATE TABLE IF NOT EXISTS resolutions (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    solved_by VARCHAR(100) NOT NULL,
    ticket_id INTEGER UNIQUE NOT NULL REFERENCES tickets(id)
);



-- =====================================
-- USERS (20)
-- =====================================
INSERT INTO users (full_name, email, role) VALUES
('Jean Dupont', 'jean.dupont@helpdesk.com', 'client'),
('Sara Diallo', 'sara.diallo@helpdesk.com', 'technician'),
('Karim Benali', 'karim.benali@helpdesk.com', 'technician'),
('Amina Traoré', 'amina.traore@helpdesk.com', 'client'),
('Lucas Martin', 'lucas.martin@helpdesk.com', 'client'),
('Nadia Leroy', 'nadia.leroy@helpdesk.com', 'client'),
('Thomas Bernard', 'thomas.bernard@helpdesk.com', 'technician'),
('Inès Robert', 'ines.robert@helpdesk.com', 'client'),
('Mohamed Camara', 'mohamed.camara@helpdesk.com', 'client'),
('Julie Moreau', 'julie.moreau@helpdesk.com', 'admin'),
('Omar Haddad', 'omar.haddad@helpdesk.com', 'client'),
('Emma Petit', 'emma.petit@helpdesk.com', 'client'),
('Yanis Lefevre', 'yanis.lefevre@helpdesk.com', 'technician'),
('Claire Fontaine', 'claire.fontaine@helpdesk.com', 'client'),
('Moussa Diarra', 'moussa.diarra@helpdesk.com', 'client'),
('Sophie Garnier', 'sophie.garnier@helpdesk.com', 'client'),
('Hugo Lambert', 'hugo.lambert@helpdesk.com', 'technician'),
('Fatou Ndiaye', 'fatou.ndiaye@helpdesk.com', 'client'),
('Antoine Rousseau', 'antoine.rousseau@helpdesk.com', 'client'),
('Mariam Coulibaly', 'mariam.coulibaly@helpdesk.com', 'admin');

-- =====================================
-- CATEGORIES (10)
-- =====================================
INSERT INTO categories (name) VALUES
('Réseau'),
('Matériel'),
('Logiciel'),
('Sécurité'),
('VPN'),
('WiFi'),
('Imprimante'),
('Messagerie'),
('Base de données'),
('Support général');

-- =====================================
-- TAGS (5)
-- =====================================
INSERT INTO tags (name) VALUES
('urgent'),
('bug'),
('lenteur'),
('incident'),
('support');

-- =====================================
-- TICKETS (21)
-- 11 open / 5 in_progress / 5 resolved
-- =====================================
INSERT INTO tickets (
title,
description,
status,
priority,
suggested_category,
ai_hint,
owner_id,
category_id
) VALUES

-- OPEN (11)
('Connexion internet coupée','Le poste ne se connecte plus au réseau.','open','high','Réseau','Vérifier routeur.',1,1),
('VPN inaccessible','Connexion VPN impossible.','open','high','VPN','Contrôler certificat.',2,5),
('WiFi faible','Connexion lente au WiFi.','open','medium','WiFi','Tester borne.',3,6),
('Imprimante bloquée','Bourrage papier affiché.','open','low','Imprimante','Redémarrer imprimante.',4,7),
('Erreur logiciel RH','Erreur au lancement du logiciel.','open','medium','Logiciel','Réinstaller logiciel.',5,3),
('Alerte sécurité','Antivirus détecte menace.','open','high','Sécurité','Analyser poste.',6,4),
('Boîte mail pleine','Ne reçoit plus de mails.','open','medium','Messagerie','Nettoyer boîte.',7,8),
('SQL lente','Requêtes lentes sur base.','open','high','Base de données','Vérifier index.',8,9),
('PC ne démarre plus','Écran noir au démarrage.','open','high','Matériel','Tester alimentation.',9,2),
('Support poste','Demande aide configuration.','open','low','Support général','Assistance simple.',10,10),
('Connexion bureau distant KO','Accès refusé RDP.','open','medium','Support général','Vérifier accès.',11,10),

-- IN PROGRESS (5)
('Ordinateur lent','Le PC est très lent.','in_progress','medium','Matériel','Nettoyage en cours.',12,2),
('Serveur inaccessible','Serveur applicatif HS.','in_progress','high','Réseau','Diagnostic réseau.',13,1),
('Cloud indisponible','Service cloud ne répond plus.','in_progress','high','Support général','Analyse fournisseur.',14,10),
('Disque saturé','Le disque serveur est plein.','in_progress','high','Base de données','Suppression fichiers.',15,9),
('Téléphone IP muet','Téléphone ne sonne plus.','in_progress','medium','Support général','Contrôle SIP.',16,10),

-- RESOLVED (5)
('Compte verrouillé','Compte bloqué après essais.','resolved','low','Support général','Compte débloqué.',17,10),
('Sauvegarde échouée','Backup nocturne KO.','resolved','high','Base de données','Backup relancé.',18,9),
('Application blanche','Page blanche application métier.','resolved','medium','Logiciel','Backend redémarré.',19,3),
('Déploiement KO','Erreur pipeline CI/CD.','resolved','medium','Logiciel','Variables corrigées.',20,3),
('Mot de passe oublié','Utilisateur ne peut plus se connecter.','resolved','low','Support général','Mot de passe changé.',1,10);

-- =====================================
-- TICKET_TAG
-- =====================================
INSERT INTO ticket_tag (ticket_id, tag_id) VALUES
(1,1),(1,4),
(2,1),(2,4),
(3,3),
(4,4),
(5,2),
(6,1),
(7,5),
(8,2),
(9,4),
(10,5),
(11,4),
(12,3),
(13,1),
(14,4),
(15,4),
(16,5),
(17,5),
(18,4),
(19,2),
(20,2),
(21,5);

-- =====================================
-- RESOLUTIONS (5 tickets résolus)
-- =====================================
INSERT INTO resolutions (content, solved_by, ticket_id) VALUES
('Compte déverrouillé et accès restauré.','Sara Diallo',17),
('Sauvegarde relancée avec succès.','Karim Benali',18),
('Service backend redémarré.','Thomas Bernard',19),
('Variables du pipeline corrigées.','Julie Moreau',20),
('Mot de passe réinitialisé.','Sara Diallo',21);