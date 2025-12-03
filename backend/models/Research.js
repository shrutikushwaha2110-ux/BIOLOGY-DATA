const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    authors: [{ type: String }],
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
