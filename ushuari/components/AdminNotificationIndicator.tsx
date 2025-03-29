// components/AdminNotificationIndicator.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NotificationIndicatorProps {
  type: "organizations" | "users" | "calls";
}

const AdminNotificationIndicator = ({ type }: NotificationIndicatorProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // In a real app, this would fetch the counts from your API
    // For demo purposes, we'll simulate different counts
    const fetchCounts = () => {
      setTimeout(() => {
        switch (type) {
          case "organizations":
            setCount(2); // Mock: 2 pending organizations
            break;
          case "users":
            setCount(0); // No pending user actions
            break;
          case "calls":
            setCount(3); // Mock: 3 unassigned calls
            break;
          default:
            setCount(0);
        }
      }, 500);
    };

    fetchCounts();

    // In a real app, you might set up a polling interval or websocket
    const interval = setInterval(fetchCounts, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [type]);

  if (count === 0) {
    return null;
  }

  return (
    <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {count > 9 ? "9+" : count}
    </span>
  );
};

export default AdminNotificationIndicator;
