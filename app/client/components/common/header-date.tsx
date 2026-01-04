"use client";

import { useEffect, useState } from "react";

export function HeaderDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      setDate(new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!date) return null;

  return (
    <p className="text-sm text-slate-600 dark:text-slate-400">{date}</p>
  );
}
