"use client";

import { useState } from "react";

const FACEBOOK_HOSTS = ["facebook.com", "www.facebook.com", "fb.watch", "m.facebook.com"];

function isFacebookUrl(value) {
  try {
    const parsed = new URL(value);
    return FACEBOOK_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [downloadCandidates, setDownloadCandidates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmed = videoUrl.trim();

    if (!trimmed) {
      setMessage("Please paste a Facebook video or Reel link.");
      setMessageType("error");
      setDownloadCandidates([]);
      return;
    }

    if (!isFacebookUrl(trimmed)) {
      setMessage("That does not look like a Facebook URL.");
      setMessageType("error");
      setDownloadCandidates([]);
      return;
    }

    setIsSubmitting(true);
    setMessage("Fetching links from RapidAPI...");
    setMessageType("");
    setDownloadCandidates([]);

    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(trimmed)}`);
      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.error || "Unable to fetch download links.");
        setMessageType("error");
        setDownloadCandidates([]);
        return;
      }

      const links = Array.isArray(payload.downloadCandidates) ? payload.downloadCandidates : [];

      if (links.length === 0) {
        setMessage("No direct links were returned for this URL.");
        setMessageType("error");
        setDownloadCandidates([]);
        return;
      }

      setMessage("Download links generated.");
      setMessageType("success");
      setDownloadCandidates(links);
    } catch {
      setMessage("Network error while contacting the downloader service.");
      setMessageType("error");
      setDownloadCandidates([]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page">
      <header className="hero card">
        <p className="badge">Fast • Free • No Login</p>
        <h1>Download Facebook Videos &amp; Reels</h1>
        <p className="subtitle">
          Paste a public Facebook video or Reel link and generate download links in seconds.
        </p>

        <form className="download-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="videoUrl" className="sr-only">
            Facebook URL
          </label>
          <input
            id="videoUrl"
            name="videoUrl"
            type="url"
            placeholder="https://www.facebook.com/reel/..."
            required
            autoComplete="off"
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Generating..." : "Get Download Link"}
          </button>
        </form>

        <div className={`message ${messageType}`.trim()} role="status" aria-live="polite">
          {message}
        </div>

        {downloadCandidates.length > 0 ? (
          <ul className="downloads card">
            {downloadCandidates.map((item, index) => (
              <li key={`${item.url}-${index}`}>
                <span>{item.quality || "unknown"}</span>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Download
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <section className="features">
        <article className="card">
          <h2>How it works</h2>
          <ol>
            <li>Copy a public Facebook video/Reel URL.</li>
            <li>Paste it in the field above.</li>
            <li>Click <strong>Get Download Link</strong> and pick a quality.</li>
          </ol>
        </article>

        <article className="card">
          <h2>Why users like it</h2>
          <ul>
            <li>Powered by RapidAPI integration.</li>
            <li>Mobile and desktop friendly interface.</li>
            <li>No account required for this website.</li>
          </ul>
        </article>
      </section>

      <footer className="footer">
        <p>
          Only download content you own or have permission to use. Respect copyright and platform
          terms.
        </p>
      </footer>
    </main>
  );
}
