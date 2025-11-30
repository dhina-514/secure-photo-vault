import React from "react";
import UploadForm from "../components/UploadForm";

function UploadPage() {
  const handleUploadSuccess = () => {
    // For now we just stay on the page.
    // You could navigate to /gallery after upload if you want.
  };

  return (
    <div className="container main-vault-container">
      <div className="card glass-card mb-4">
        <div className="card-body">
          <h5 className="section-title mb-2">Upload</h5>
          <p className="section-subtitle mb-3">
            Encrypt images locally using your vault password, then upload to
            secure storage.
          </p>
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
