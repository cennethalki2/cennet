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
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmed = videoUrl.trim();

    if (!trimmed) {
      setMessage("Please paste a Facebook video or Reel link.");
      setMessageType("error");
      setDownloadUrl("");
      return;
    }

    if (!isFacebookUrl(trimmed)) {
      setMessage("That does not look like a Facebook URL.");
      setMessageType("error");
      setDownloadUrl("");
      return;
    }

    setIsSubmitting(true);
    setMessage("Processing your link...");
    setMessageType("");
    setDownloadUrl("");

    await new Promise((resolve) => setTimeout(resolve, 850));

    const encoded = encodeURIComponent(trimmed);
    const generated = `/api/download?url=${encoded}`;

    setMessage("Download link generated.");
    setMessageType("success");
    setDownloadUrl(generated);
    setIsSubmitting(false);
  }

  return (
    <main className="page">
      <header className="hero card">
        <p className="badge">Fast • Free • No Login</p>
        <h1>Download Facebook Videos &amp; Reels</h1>
        <p className="subtitle">
          Paste a public Facebook video or Reel link and generate a download link in seconds.
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
          {downloadUrl ? (
            <>
              {message} <a href={downloadUrl}>Download video</a>
            </>
          ) : (
            message
          )}
        </div>
      </header>

      <section className="features">
        <article className="card">
          <h2>How it works</h2>
          <ol>
            <li>Copy a public Facebook video/Reel URL.</li>
            <li>Paste it in the field above.</li>
            <li>Click <strong>Get Download Link</strong> and save the file.</li>
          </ol>
        </article>

        <article className="card">
          <h2>Why users like it</h2>
          <ul>
            <li>Supports standard videos and Reels.</li>
            <li>Mobile and desktop friendly interface.</li>
            <li>No account required.</li>
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
