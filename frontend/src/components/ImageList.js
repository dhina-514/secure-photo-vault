// frontend/src/components/ImageList.js
import React, { useEffect, useState } from "react";
import API from "../api";
import { decryptToBase64, base64ToImageUrl } from "../cryptoHelpers";

function ImageList({ refreshFlag }) {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [vaultPassword, setVaultPassword] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewMimeType, setPreviewMimeType] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // fullscreen viewer state
  const [isFullscreen, setIsFullscreen] = useState(false);

  async function fetchItems() {
    try {
      const res = await API.get("/images");
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching items");
    }
  }

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag]);

  function handleSelect(item) {
    setSelectedItem(item);
    setVaultPassword("");
    setPreviewUrl(null);
    setPreviewMimeType(null);
    setMessage("");
  }

  async function handleDecryptAndShow(e) {
    e.preventDefault();
    if (!selectedItem || !vaultPassword) {
      setMessage("Select an item and enter vault password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Decrypting…");

      const res = await API.get(`/images/${selectedItem._id}/content`);
      const { ciphertext, mimeType } = res.data;

      const base64 = decryptToBase64(ciphertext, vaultPassword);
      if (!base64) {
        setMessage("Wrong vault password or corrupted data.");
        setPreviewUrl(null);
        setPreviewMimeType(null);
        setLoading(false);
        return;
      }

      let url;
      if (mimeType && mimeType.startsWith("image/")) {
        // use helper to keep behaviour same for images
        url = base64ToImageUrl(base64, mimeType);
      } else {
        // generic blob URL for videos or unknown types
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType || "application/octet-stream" });
        url = URL.createObjectURL(blob);
      }

      setPreviewUrl(url);
      setPreviewMimeType(mimeType);
      setMessage("Decryption successful!");
    } catch (err) {
      console.error(err);
      setMessage("Error decrypting file");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadEncrypted(item) {
    try {
      const res = await API.get(`/images/${item._id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.originalName + ".enc";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setMessage("Error downloading encrypted file");
    }
  }

  async function handleDownloadDecrypted() {
    if (!selectedItem || !previewUrl || !previewMimeType || !vaultPassword) {
      setMessage("Decrypt the item first.");
      return;
    }

    try {
      setMessage("Preparing decrypted download…");

      // We re-fetch ciphertext, decrypt again and build Blob, then download.
      const res = await API.get(`/images/${selectedItem._id}/content`);
      const { ciphertext, mimeType } = res.data;
      const base64 = decryptToBase64(ciphertext, vaultPassword);
      if (!base64) {
        setMessage("Wrong vault password or corrupted data.");
        return;
      }

      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: mimeType || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedItem.originalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setMessage("Decrypted file downloaded.");
    } catch (err) {
      console.error(err);
      setMessage("Error downloading decrypted file");
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item.originalName}" from vault?`)) return;

    try {
      await API.delete(`/images/${item._id}`);
      setItems((prev) => prev.filter((it) => it._id !== item._id));
      if (selectedItem && selectedItem._id === item._id) {
        setSelectedItem(null);
        setPreviewUrl(null);
        setPreviewMimeType(null);
        setVaultPassword("");
      }
      setMessage("Item deleted.");
    } catch (err) {
      console.error(err);
      setMessage("Error deleting item");
    }
  }

  // Filter + sort
  const filteredItems = items
    .filter((item) =>
      item.originalName.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      // default
      return 0;
    });

  const isVideo = (mime) => mime && mime.startsWith("video/");
  const isImage = (mime) => mime && mime.startsWith("image/");

  return (
    <div>
      <h5 className="card-title mb-2">Library</h5>
      <p className="small text-muted mb-3">
        Search, decrypt and manage your encrypted images and videos.
      </p>

      {/* Search + sort */}
      <div className="d-flex align-items-center mb-2 gap-2">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search by filename…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: "140px" }}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* List of items */}
      {filteredItems.length === 0 && (
        <small className="text-muted">No items yet.</small>
      )}

      {filteredItems.length > 0 && (
        <ul
          className="list-group mb-3"
          style={{ maxHeight: "220px", overflowY: "auto" }}
        >
          {filteredItems.map((item) => (
            <li
              key={item._id}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                selectedItem && selectedItem._id === item._id
                  ? "border-primary"
                  : ""
              }`}
            >
              <div className="d-flex flex-column">
                <span className="text-truncate" style={{ maxWidth: "240px" }}>
                  {item.originalName}
                </span>
                <small className="text-muted">
                  {item.mimeType?.startsWith("video/") ? "Video" : "Image"} •{" "}
                  {Math.round((item.size || 0) / 1024)} KB
                </small>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={() => handleSelect(item)}
                >
                  View
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleDownloadEncrypted(item)}
                >
                  Enc
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(item)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Decrypt form + preview */}
      {selectedItem && (
        <div>
          <h6 className="mb-2">
            Decrypt &amp; View:{" "}
            <span className="text-info">{selectedItem.originalName}</span>
          </h6>
          <form onSubmit={handleDecryptAndShow} className="mb-2">
            <div className="mb-2">
              <input
                type="password"
                className="form-control form-control-sm"
                value={vaultPassword}
                onChange={(e) => setVaultPassword(e.target.value)}
                placeholder="Enter vault password"
              />
            </div>
            <div className="d-flex flex-wrap gap-2 mb-2">
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={loading}
              >
                {loading ? "Decrypting…" : "Decrypt & View"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleDownloadEncrypted.bind(null, selectedItem)}
              >
                Download Enc
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleDownloadDecrypted}
              >
                Download Decrypted
              </button>
              {previewUrl && (
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={() => setIsFullscreen(true)}
                >
                  Fullscreen
                </button>
              )}
            </div>
          </form>

          {message && (
            <div className="mb-2">
              <small className="text-muted">{message}</small>
            </div>
          )}

          {/* Inline preview */}
          {previewUrl && (
            <div className="mt-2">
              {isImage(previewMimeType) && (
                <img
                  src={previewUrl}
                  alt={selectedItem.originalName}
                  className="img-fluid rounded border border-secondary"
                  style={{ maxHeight: "260px" }}
                />
              )}

              {isVideo(previewMimeType) && (
                <video
                  src={previewUrl}
                  controls
                  className="img-fluid rounded border border-secondary"
                  style={{ maxHeight: "260px", backgroundColor: "#000" }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX */}
      {isFullscreen && previewUrl && (
        <div className="lightbox-backdrop" onClick={() => setIsFullscreen(false)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-controls">
              <div className="small">
                {selectedItem ? selectedItem.originalName : "Preview"}
              </div>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setIsFullscreen(false)}
              >
                Close
              </button>
            </div>
            <div className="lightbox-image-wrapper">
              {isImage(previewMimeType) && (
                <img src={previewUrl} alt={selectedItem?.originalName} />
              )}
              {isVideo(previewMimeType) && (
                <video
                  src={previewUrl}
                  controls
                  autoPlay
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageList;
