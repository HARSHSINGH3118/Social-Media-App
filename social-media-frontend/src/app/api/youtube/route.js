// app/api/youtube/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "IN";
  // 24 is “Entertainment” category in YT Data API
  const categoryId = searchParams.get("category") || "24";
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY not set" },
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://youtube.googleapis.com/youtube/v3/videos?` +
      new URLSearchParams({
        part: "snippet",
        chart: "mostPopular",
        regionCode: region,
        videoCategoryId: categoryId,
        maxResults: "5",
        key: apiKey,
      })
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: res.status }
    );
  }
  const json = await res.json();
  return NextResponse.json(json);
}
