const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const researchRoutes = require("./routes/researchRoutes");
const filtersRoutes = require("./routes/filtersRoutes");
const searchRoutes = require("./routes/searchRoutes");
const filesRoutes = require("./routes/filesRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ---------- REGISTER ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/filters", filtersRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/uploads", filesRoutes);

// Inline fallback for categories: ensure endpoint available even if router mounting fails
try {
  const { getCategories } = require('./controllers/categoryController');
  app.get('/api/categories', getCategories);
} catch (e) {
  console.warn('Could not mount inline /api/categories handler:', e.message);
}

// ---------- DEFAULT ROUTE ----------
app.get("/", (req, res) => {
  res.send("BioInData Backend OK 🚀");
});

// Quick direct test route to verify path handling
app.get('/api/categories/test', (req, res) => {
  res.json({ ok: true, msg: 'direct test route' });
});

// Diagnostic: list mounted routes
app.get('/__routes', (req, res) => {
  if (!app._router) return res.json({ routes: [] });
  const routes = app._router.stack
    .filter((layer) => layer && (layer.route || layer.name === 'router'))
    .map((layer) => {
      if (layer.route) {
        return {
          path: layer.route.path,
          methods: layer.route.methods,
        };
      }
      if (layer.name === 'router' && layer.regexp) {
        return { name: 'router', regexp: layer.regexp.source };
      }
      return { name: layer.name };
    });
  res.json({ routes });
});

const PORT = process.env.PORT || 5000;

// Log registered routes (simple listing)
if (app._router && app._router.stack) {
  const summary = app._router.stack.map((layer) => {
    return {
      name: layer.name,
      path: layer.regexp && layer.regexp.source ? layer.regexp.source : undefined,
      hasRoute: !!layer.route,
    };
  });
  console.log('Route stack summary:');
  console.log(summary);
}

app.listen(PORT, () => {
  console.log(`🚀 BioInData Backend Running on port ${PORT}`);
});
