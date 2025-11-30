import React from "react";
import ImageList from "../components/ImageList";

function GalleryPage() {
  return (
    <div className="container main-vault-container">
      <div className="card glass-card mb-4">
        <div className="card-body">
          <h5 className="section-title mb-2">Gallery</h5>
          <p className="section-subtitle mb-3">
            Browse, decrypt, and manage your encrypted images.
          </p>
          {/* refreshFlag can be 0; ImageList will still fetch on mount */}
          <ImageList refreshFlag={0} />
        </div>
      </div>
    </div>
  );
}

export default GalleryPage;
