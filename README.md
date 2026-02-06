# 12Do

[▶ Visionner la démo](https://streamable.com/g734vj)



**12Do** est une application moderne de gestion de tâches avec un **dashboard interactif** et un **agenda intégré**, conçue pour organiser efficacement son quotidien.

---

## ✨ Fonctionnalités

- Création, modification et suppression de tâches
- Dashboard pour une vue d’ensemble claire
- Agenda intégré pour la planification
- Authentification sécurisée
- Connexion via **Google**
- Architecture moderne **FastAPI + React**

---

## 🧱 Stack technique

### Backend
- FastAPI  
- SQLAlchemy  
- PostgreSQL / SQLite (tests)  
- JWT Authentication  

### Frontend
- React  
- Vite  
- Node.js  

---

## 🚀 Installation

### 1. Variables d’environnement

Créer un fichier `.env` à la racine du dossier **fastapi-back** :

```env
SQLALCHEMY_DB_URL=postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
SQLALCHEMY_DB_TEST_URL=sqlite:///**your db name
SECRET_KEY=your_secret_key
ALGORITHM=HS256
```

### 2. Backend – FastAPI

Installer les dépendences

```bash
cd fastapiback/TodoApp
python3 -m pip install -r requirements.txt
```

Lancer le serveur 

```bash
cd fastapi-back/
python3 -m uvicorn TodoApp.main:app --reload
```

### 3. Frontend – React

Installer les dépendences et démarrer le serveur

```bash
cd react-frontend/
npm install
npm run dev
```

Serveur disponible sur :

```localhost
http://localhost:5173
```

### 🔐 Utilisation 

* Inscription avec vos identifiants
* Connexion avec vos identifiants ou
* Connexion rapide via Google
Après connexion, gérez vos tâches depuis le dashboard et planifiez-les dans l’agenda.

### 📁 Structure du projet

```txt
.
├── fastapiback/
│   └── TodoApp/
│       └── main.py
├── react-frontend/
│   └── src/
│       └── main.jsx
└── README.md
```

### 📌 Notes

* Python 3.10+ requis
* Node.js 18+ recommandé
* Le fichier .env ne doit pas être versionné
* SQLite est utilisé uniquement pour les tests