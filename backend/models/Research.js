const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    abstract: { type: String, required: true },
    description: String,
    authors: [{ type: String }],
    source_name: String,
    source_url: String,
    journal: String,
    doi: String,
    last_updated: String,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: [{ type: String }],
    year: Number,
    dataset_file: String,
    image_files: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Research", researchSchema);
