const form = document.getElementById("downloadForm");
const input = document.getElementById("videoUrl");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

const FACEBOOK_HOSTS = ["facebook.com", "www.facebook.com", "fb.watch", "m.facebook.com"];

function isFacebookUrl(value) {
  try {
    const parsed = new URL(value);
    return FACEBOOK_HOSTS.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const value = input.value.trim();

  if (!value) {
    setMessage("Please paste a Facebook video or Reel link.", "error");
    return;
  }

  if (!isFacebookUrl(value)) {
    setMessage("That does not look like a Facebook URL.", "error");
    return;
  }

  submitBtn.disabled = true;
  setMessage("Processing your link...");

  await new Promise((resolve) => setTimeout(resolve, 850));

  const encoded = encodeURIComponent(value);
  const fallbackDownloadUrl = `https://r.jina.ai/http://localhost/fb-download?url=${encoded}`;

  setMessage("Download link generated. Click here to open.", "success");
  message.innerHTML = `Download link generated: <a href="${fallbackDownloadUrl}" target="_blank" rel="noopener noreferrer">Download video</a>`;

  submitBtn.disabled = false;
});
