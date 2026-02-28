import { NextResponse } from "next/server";

const FACEBOOK_HOSTS = ["facebook.com", "www.facebook.com", "fb.watch", "m.facebook.com"];
const RAPIDAPI_HOST = "all-social-media-video-downloader2.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "ce543e86aemsha71f511c923a191p1ad693jsn20831b2fdf21";
const RAPIDAPI_ENDPOINT = process.env.RAPIDAPI_ENDPOINT || `https://${RAPIDAPI_HOST}/`;

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

function extractDownloadCandidates(payload) {
  const candidates = [];

  if (Array.isArray(payload?.links)) {
    for (const link of payload.links) {
      if (typeof link?.url === "string" && link.url) {
        candidates.push({
          url: link.url,
          quality: link.quality || link.type || "unknown"
        });
      }
    }
  }

  if (Array.isArray(payload?.data)) {
    for (const item of payload.data) {
      if (typeof item?.url === "string" && item.url) {
        candidates.push({
          url: item.url,
          quality: item.quality || item.type || "unknown"
        });
      }
    }
  }

  if (typeof payload?.url === "string" && payload.url) {
    candidates.push({ url: payload.url, quality: "default" });
  }

  return candidates;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url")?.trim() || "";

  if (!rawUrl || !isFacebookUrl(rawUrl)) {
    return NextResponse.json(
      { error: "Please provide a valid Facebook video or Reel URL." },
      { status: 400 }
    );
  }

  try {
    const upstreamUrl = `${RAPIDAPI_ENDPOINT}?url=${encodeURIComponent(rawUrl)}`;

    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const bodyText = await response.text();
      return NextResponse.json(
        {
          error: "RapidAPI request failed.",
          status: response.status,
          detail: bodyText.slice(0, 600)
        },
        { status: 502 }
      );
    }

    const payload = await response.json();
    const downloadCandidates = extractDownloadCandidates(payload);

    return NextResponse.json({
      sourceUrl: rawUrl,
      downloadCandidates,
      raw: payload
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to process this request right now.",
        detail: error instanceof Error ? error.message : "unknown error"
      },
      { status: 500 }
    );
  }
}
