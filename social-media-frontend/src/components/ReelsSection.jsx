"use client";

import useSWR from "swr";
import { Clapperboard } from "lucide-react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ReelsSection({ region = "IN", category = "24" }) {
  const { data, error } = useSWR(
    `/api/youtube?region=${region}&category=${category}`,
    fetcher
  );

  if (error) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-md text-red-500">
        Error loading videos.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-md text-gray-600">
        Loading reels…
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-md transition hover:shadow-lg space-y-4">
      <div className="flex items-center gap-2 text-pink-600">
        <Clapperboard className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Entertainment Reels</h2>
      </div>
      <hr className="border-t border-gray-200" />

      <ul className="space-y-3">
        {data.items.map((v) => (
          <li
            key={v.id}
            className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-md transition"
          >
            <img
              src={v.snippet.thumbnails.medium.url}
              alt={v.snippet.title}
              className="w-24 h-14 object-cover rounded-md"
            />
            <div className="flex-1">
              <a
                href={`https://youtu.be/${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gray-800 hover:text-pink-600 transition line-clamp-2"
              >
                {v.snippet.title}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
