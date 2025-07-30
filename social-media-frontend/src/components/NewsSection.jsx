"use client";

import { useEffect, useState } from "react";
import { Newspaper } from "lucide-react";

export default function NewsSection({ title = "Top Indian Headlines" }) {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setArticles(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Error loading news.");
      });
  }, []);

  return (
    <div className="bg-white p-5 rounded-xl shadow-md transition hover:shadow-lg space-y-4">
      <div className="flex items-center gap-2 text-purple-700">
        <Newspaper className="w-5 h-5" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <hr className="border-t border-gray-200" />

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((a, i) => (
            <li
              key={i}
              className="flex items-start gap-3 transition hover:bg-gray-50 p-2 rounded-md"
            >
              <img
                src={a.image || "/default-news.png"}
                alt={a.title}
                className="w-16 h-16 rounded-md object-cover aspect-square"
              />
              <div className="flex-1">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-800 hover:text-purple-600 transition-colors line-clamp-2"
                >
                  {a.title}
                </a>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {a.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Source: {a.source?.name || "Unknown"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
