import { useState } from "react";
import { API_BASE } from "../utils/api";
import "../styles/Modal.css";
import "../styles/UploadModal.css";

function UploadModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const categories = [
    "Genomics",
    "Proteomics",
    "Population Health",
    "Disease Research",
    "Drug Discovery",
    "Clinical Trials",
    "Bioinformatics",
    "Other"
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    
    // Create preview for first file if it's an image or CSV
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!title || !description || !category || files.length === 0) {
      setError("Please fill all fields and select files");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      files.forEach((file) => {
        formData.append("files", file);
      });

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/uploads`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setSuccess("Upload successful!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-content">
          <h2>Upload Research Data</h2>
          <p className="modal-subtitle">Share your datasets, charts, and research findings</p>

          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Genome Sequencing Analysis 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                placeholder="Describe your research, methodology, findings..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label>Upload Files (CSV, JSON, Images, Charts) *</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept=".csv,.json,.xlsx,.jpg,.png,.pdf"
                  required
                />
                <div className="file-input-label">
                  Click to select files or drag and drop
                </div>
              </div>
              {files.length > 0 && (
                <div className="files-list">
                  <p>Selected files ({files.length}):</p>
                  <ul>
                    {files.map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {preview && (
              <div className="preview-section">
                <label>Preview</label>
                <div className="preview">
                  <img src={preview} alt="Preview" style={{ maxWidth: "300px", maxHeight: "200px" }} />
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-actions">
              <button type="submit" className="btn-primary-modal" disabled={loading}>
                {loading ? "Uploading..." : "Upload Data"}
              </button>
              <button type="button" className="btn-secondary-modal" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>

          <div className="upload-guidelines">
            <h4>Upload Guidelines</h4>
            <ul>
              <li>Maximum file size: 50MB</li>
              <li>Supported formats: CSV, JSON, XLSX, PNG, JPG, PDF</li>
              <li>Include metadata and descriptions for better searchability</li>
              <li>Ensure data is properly formatted and clean</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
