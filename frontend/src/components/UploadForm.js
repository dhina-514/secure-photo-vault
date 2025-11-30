// frontend/src/components/UploadForm.js
import React, { useState, useRef } from "react";
import API from "../api";
import { fileToBase64, encryptBase64 } from "../cryptoHelpers";

function UploadForm({ onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [vaultPassword, setVaultPassword] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setMessage("");
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    setFiles(dropped);
    setMessage("");
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function openFileDialog() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!files.length || !vaultPassword) {
      setMessage("Select at least one file and enter a vault password.");
      return;
    }

    try {
      setUploading(true);
      setMessage("Encrypting and uploading…");

      for (const file of files) {
        const base64 = await fileToBase64(file);
        const ciphertext = encryptBase64(base64, vaultPassword);

        const cipherBlob = new Blob([ciphertext], { type: "text/plain" });
        const formData = new FormData();
        formData.append("encryptedFile", cipherBlob, file.name + ".enc");
        formData.append("originalName", file.name);
        formData.append("mimeType", file.type || "application/octet-stream");

        const res = await API.post("/images/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (onUploadSuccess) {
          onUploadSuccess(res.data.image);
        }
      }

      setMessage("All files encrypted and uploaded successfully.");
      setFiles([]);
      setVaultPassword("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload error. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h5 className="card-title mb-2">Upload</h5>
      <p className="small text-muted mb-3">
        Encrypt photos and videos locally and store only ciphertext in the
        cloud.
      </p>

      {/* Drag & drop area */}
      <div
        className="border rounded-3 p-3 mb-3 drag-area"
        style={{
          backgroundColor: "#020617",
          borderColor: "#1f2937",
          cursor: "pointer",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={openFileDialog}
      >
        <div className="text-center small text-muted">
          <div className="mb-2">
            <span role="img" aria-label="folder">
              📁
            </span>
          </div>
          <div>Drag &amp; drop images or videos here, or click to choose.</div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="d-none"
          onChange={handleFileChange}
        />
      </div>

      {/* Show selected files count */}
      {files.length > 0 && (
        <div className="small mb-3">
          <strong>{files.length}</strong> file(s) selected.
        </div>
      )}

      {/* Vault password */}
      <div className="mb-3">
        <label className="form-label">
          Vault password <span className="small text-muted">(encryption key)</span>
        </label>
        <input
          type="password"
          className="form-control form-control-sm"
          value={vaultPassword}
          onChange={(e) => setVaultPassword(e.target.value)}
          placeholder="This password encrypts your files"
        />
        <small className="text-muted">
          Remember this password. It is never sent or stored in plain text.
        </small>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={uploading}
      >
        {uploading ? "Encrypting…" : "Encrypt & Upload"}
      </button>

      {message && (
        <div className="mt-2 small text-info" style={{ minHeight: "1.2rem" }}>
          {message}
        </div>
      )}
    </form>
  );
}

export default UploadForm;
