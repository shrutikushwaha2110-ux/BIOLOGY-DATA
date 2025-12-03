const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/categoryRoutes");
const researchRoutes = require("./routes/researchRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/categories", categoryRoutes);
app.use("/research", researchRoutes);

app.get("/", (req, res) => {
  res.send("BioInData Backend Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
