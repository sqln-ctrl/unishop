export const whatsappChatUrl = (phone, title) => {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (!digits) return "";
  const text = title
    ? `Hi, I'm interested in "${title}" listed on UniShop.`
    : "Hi, I saw your listing on UniShop.";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};
