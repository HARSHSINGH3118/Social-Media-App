// src/app/api/news/route.js
import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GNEWS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "GNEWS_API_KEY is not defined" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://gnews.io/api/v4/top-headlines?country=in&lang=en&max=5&token=${key}`
    );
    if (!res.ok) throw new Error("Failed to fetch");
    const { articles } = await res.json();
    // just return the array
    return NextResponse.json(articles);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error loading news." }, { status: 500 });
  }
}
