import { useState } from "react";
import "../styles/AdminUploads.css";
import { API_BASE } from "../utils/api";

function AdminUploads() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setUploading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Upload failed");
      }

      setMessage("Files uploaded successfully!");
      setFiles([]);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-uploads">
      <div className="uploads-container">
        <h2>Admin - Upload Research Data</h2>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="files">Select Files (JSON, CSV, etc.)</label>
            <input
              id="files"
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />
            {files.length > 0 && (
              <div className="files-preview">
                <p>Selected files ({files.length}):</p>
                <ul>
                  {files.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button type="submit" className="upload-btn" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </form>

        <div className="upload-info">
          <h3>Upload Guidelines</h3>
          <ul>
            <li>Supported formats: JSON, CSV, Excel</li>
            <li>Maximum file size: 10MB per file</li>
            <li>Multiple files can be uploaded at once</li>
            <li>Files will be stored in the backend data directory</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminUploads;
