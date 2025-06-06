import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateApi(date, start, end) {
  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-indexed
  const day = pad(date.getDate());
  var hours = pad(date.getHours());
  var minutes = pad(date.getMinutes());
  var seconds = pad(date.getSeconds());
  if (start) {
    hours = "00";
    minutes = "00";
    seconds = "00";
  }
  if (end) {
    hours = "23";
    minutes = "59";
    seconds = "59";
  }

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}