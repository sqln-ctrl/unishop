export const imageUrl = (src) => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("blob:")) {
    return src;
  }
  const api = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const origin = api.replace(/\/api\/?$/, "");
  return `${origin}${src.startsWith("/") ? src : `/${src}`}`;
};
