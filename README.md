# Biology in Data 🧬

A comprehensive platform for biological research data, insights, and discoveries. Explore peer-reviewed studies, visualize complex datasets, and contribute to the scientific community.

![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation & Running

**1. Clone and install dependencies:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

**2. Start the application:**

```bash
# Terminal 1 - Backend (runs on port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (runs on port 5173)
cd frontend
npm run dev
```

**3. Open your browser:**
- Frontend: http://localhost:5173
- API: http://localhost:5000/api

---

## 📁 Project Structure

```
BIOLOGY-DATA/
├── backend/                 # Express.js REST API
│   ├── controllers/         # Route handlers
│   ├── routes/              # API route definitions
│   ├── data/
│   │   ├── metadata/        # Research metadata JSON files
│   │   └── raw/             # Raw dataset files
│   ├── utils/               # Helper functions
│   └── server.js            # Main server file
│
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── api.js           # API service functions
│   │   ├── App.jsx          # Main app with routing
│   │   └── App.css          # Utility CSS classes
│   └── index.html           # Entry HTML
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/research` | List all research items |
| GET | `/api/research/:id` | Get research by ID |
| POST | `/api/research` | Create new research |
| GET | `/api/categories` | List all categories |
| GET | `/api/search?q=term` | Search research |
| GET | `/api/data` | List raw data files |
| GET | `/api/data/:filename` | Get raw data file |

---

## ✨ Features

- **Browse Research** - Filter by category, year, and search by keywords
- **Interactive Charts** - Visualize data with LineChart and BarChart
- **Categories** - Organize research by Genomics, Genetics, Agriculture, etc.
- **Upload Research** - Submit new research (requires login)
- **Admin Panel** - Manage research entries (admin role required)
- **Responsive Design** - Works on desktop and mobile

---

## 🔐 Authentication

The app uses mock authentication for demo purposes:

- **Regular User**: Any email without "admin" → Can upload research
- **Admin User**: Email containing "admin" (e.g., `admin@test.com`) → Full admin access

---

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Recharts (charts)
- Lucide React (icons)

**Backend:**
- Node.js
- Express.js
- fs-extra (file operations)
- cors, dotenv

---

## 📊 Data Format

Research metadata files in `backend/data/metadata/` follow this structure:

```json
[
  { "dataset": "research_id" },
  { "Column2": "Name", "Column3": "Source", ... },
  {
    "dataset": "research_id",
    "title": "Research Title",
    "description": "Abstract...",
    "citation": "Authors",
    "year": "2024",
    "doi": "10.xxxx/xxxxx"
  }
]
```

---

## 📝 License

MIT License - feel free to use and modify for your projects.

---

## 👤 Author

Created with ❤️ for the biological research community.
