const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const API_BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || "");
const CHAT_API_BASE_URL = trimTrailingSlash(import.meta.env.VITE_CHAT_API_BASE_URL || "");

const joinPath = (base: string, path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

export const websiteApiUrl = (path: string) => joinPath(API_BASE_URL, path);
export const chatbotApiUrl = (path: string) => joinPath(CHAT_API_BASE_URL, path);
