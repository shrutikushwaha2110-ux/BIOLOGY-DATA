const express = require("express");
const { getAllResearch, getResearchById } = require("../controllers/researchController");

const router = express.Router();

router.get("/", getAllResearch);
router.get("/:id", getResearchById);

module.exports = router;
