// frontend/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import API from "../api";

function formatDate(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function DashboardPage() {
  const email = localStorage.getItem("userEmail") || "you@example.com";

  const [stats, setStats] = useState({
    count: 0,
    lastUpload: null,
    loading: true,
  });

  // Fetch items just for stats (count + latest upload)
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await API.get("/images");
        const items = res.data || [];

        if (items.length === 0) {
          setStats({ count: 0, lastUpload: null, loading: false });
          return;
        }

        // find latest by createdAt
        const latest = items.reduce((acc, cur) => {
          if (!acc) return cur;
          return new Date(cur.createdAt) > new Date(acc.createdAt) ? cur : acc;
        }, null);

        setStats({
          count: items.length,
          lastUpload: latest?.createdAt || null,
          loading: false,
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
        setStats({ count: 0, lastUpload: null, loading: false });
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="container py-4 vault-dashboard-root">
      <div className="row g-4">
        {/* Welcome / intro card */}
        <div className="col-lg-7">
          <div className="card vault-card h-100">
            <div className="card-body">
              <h5 className="card-title mb-2">Welcome back 👋</h5>
              <p className="mb-1 dashboard-text-strong small">
                You&apos;re logged in as <strong>{email}</strong>.
              </p>
              <p className="mb-3 dashboard-text-soft small">
                This vault encrypts your photos and videos locally in your
                browser before they ever touch the server. Only encrypted
                ciphertext is stored — your vault password is never sent or
                saved.
              </p>

              <ul className="small dashboard-text-strong mb-0">
                <li>
                  Go to <strong>Upload</strong> to encrypt and upload new images
                  or videos.
                </li>
                <li>
                  Go to <strong>Gallery</strong> to browse and decrypt items
                  you&apos;ve already stored.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Overview stats card */}
        <div className="col-lg-5">
          <div className="card vault-card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Vault overview</h5>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <div className="small dashboard-text-soft">
                    Total encrypted items
                  </div>
                  <div className="fs-4 fw-semibold dashboard-text-strong">
                    {stats.loading ? "…" : stats.count}
                  </div>
                </div>
                <div className="text-end">
                  <div className="small dashboard-text-soft">Last upload</div>
                  <div className="small dashboard-text-strong">
                    {stats.loading
                      ? "Loading…"
                      : stats.count === 0
                      ? "No uploads yet"
                      : formatDate(stats.lastUpload)}
                  </div>
                </div>
              </div>

              <div className="small dashboard-text-soft">
                These stats are calculated from your stored items (images +
                videos). You can later extend this card with storage usage,
                uploads per month and more.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- HOW IT WORKS CARD --- */}
      <div className="row g-4 mt-3">
        <div className="col-12">
          <div className="card vault-card">
            <div className="card-body how-works-body">
              <h5 className="card-title mb-3">How your vault works 🔐</h5>
              <p className="small dashboard-text-soft mb-3">
                End-to-end encryption in simple terms. Everything happens in the
                browser:
              </p>

              <div className="row g-3 align-items-start">
                <div className="col-md-7">
                  <ol className="how-works-list mb-3">
                    <li>
                      <span className="fw-semibold">Encrypt in browser</span>
                      <br />
                      When you upload a file, your browser converts it to
                      Base64 and encrypts it using your vault password. The
                      server never sees the original file.
                    </li>
                    <li>
                      <span className="fw-semibold">
                        Only ciphertext hits the server
                      </span>
                      <br />
                      The backend receives only encrypted data
                      (random-looking ciphertext) plus minimal metadata like
                      filename, size and MIME type.
                    </li>
                    <li>
                      <span className="fw-semibold">
                        Password never leaves your device
                      </span>
                      <br />
                      Your vault password and the derived encryption key stay in
                      the browser&apos;s memory. They&apos;re never sent in any
                      API request.
                    </li>
                    <li>
                      <span className="fw-semibold">Decrypt locally</span>
                      <br />
                      When you click <strong>View</strong>, the encrypted
                      content is downloaded, decrypted on your device using your
                      password and then rendered as an image or video.
                    </li>
                  </ol>
                </div>

                {/* Simple visual flow */}
                <div className="col-md-5">
                  <div className="how-works-diagram p-3 rounded-3">
                    <div className="d-flex flex-column gap-2 small">
                      <div className="d-flex align-items-center">
                        <span className="how-badge me-2">1</span>
                        <div>
                          <div className="fw-semibold">Browser</div>
                          <div className="dashboard-text-soft">
                            File + password → encrypted blob
                          </div>
                        </div>
                      </div>

                      <div className="text-center my-1">
                        <span className="badge bg-secondary-subtle text-light">
                          🔁 ciphertext only
                        </span>
                      </div>

                      <div className="d-flex align-items-center">
                        <span className="how-badge me-2">2</span>
                        <div>
                          <div className="fw-semibold">Server</div>
                          <div className="dashboard-text-soft">
                            Stores encrypted blob + metadata
                          </div>
                        </div>
                      </div>

                      <div className="text-center my-1">
                        <span className="badge bg-secondary-subtle text-light">
                          ⬇ download encrypted
                        </span>
                      </div>

                      <div className="d-flex align-items-center">
                        <span className="how-badge me-2">3</span>
                        <div>
                          <div className="fw-semibold">Browser again</div>
                          <div className="dashboard-text-soft">
                            Ciphertext + password → decrypted image / video
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 small dashboard-text-soft">
                        Result: the server never sees your password or the
                        decrypted content. Only you can unlock your vault.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end row */}
            </div>
          </div>
        </div>
      </div>
      {/* --- END HOW IT WORKS CARD --- */}
    </div>
  );
}

export default DashboardPage;
