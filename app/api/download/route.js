import { NextResponse } from "next/server";

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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url")?.trim() || "";

  if (!rawUrl || !isFacebookUrl(rawUrl)) {
    return NextResponse.json(
      { error: "Please provide a valid Facebook video or Reel URL." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    sourceUrl: rawUrl,
    message: "Backend download service not configured yet."
  });
}
