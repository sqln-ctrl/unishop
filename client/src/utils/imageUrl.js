export const imageUrl = (src) => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("blob:")) {
    return src;
  }
  const api = process.env.NEXT_PUBLIC_API_URL || "/api";
  const origin = api.replace(/\/api\/?$/, "");
  return `${origin}${src.startsWith("/") ? src : `/${src}`}`;
};
