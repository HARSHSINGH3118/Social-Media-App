"use client";

import { motion } from "framer-motion";

export default function Hero3D() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      style={{ height: "480px" }}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">Welcome to Huddle</h2>
        <p className="text-gray-600 mb-4">
          Huddle is your one‑stop community hub—chat, post, share and stay in
          the loop.
        </p>
      </div>

      {/* Embed Spline as iframe */}
      <div className="w-full h-[300px]">
        <iframe
          src="https://my.spline.design/3dtextbluecopy-wxFYL9id0twcH3OJLN3cBU2r/"
          frameBorder="0"
          width="100%"
          height="100%"
          allowFullScreen
        ></iframe>
      </div>
    </motion.div>
  );
}
