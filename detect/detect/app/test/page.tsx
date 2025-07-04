"use client";

import React, { useState } from "react";
import { UAParser } from "ua-parser-js";

export default function Page() {
  const [deviceType, setDeviceType] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const handleClick = async () => {
    try {
      const parser = new UAParser();
      const type = parser.getResult().device.type || "Desktop";
      setDeviceType(type);

      let sessionId = localStorage.getItem("userSessionId");
      if (!sessionId) {
        sessionId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("userSessionId", sessionId);
      }

      const res = await fetch("http://192.168.0.8:3000/api/v1/detector", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionId,
        },
        body: JSON.stringify({ deviceType: type }),
      });

      const data = await res.json();
      setResponseMsg(data.message);
    } catch (err) {
      setResponseMsg("Error sending data");
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-gray-100 text-center">
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-xl shadow-md hover:bg-blue-700 transition duration-200"
      >
        View Details
      </button>

      {deviceType && (
        <div className="text-gray-800 text-lg">
          Detected Device: <strong>{deviceType}</strong>
        </div>
      )}

      {responseMsg && (
        <div className="text-gray-700">
          Server: <span>{responseMsg}</span>
        </div>
      )}
    </div>
  );
}
