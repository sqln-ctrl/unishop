export const normalizeWhatsAppNumber = (input) => {
  if (!input || typeof input !== "string") return "";

  let digits = input.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `92${digits.slice(1)}`;

  return digits;
};

export const isValidWhatsAppNumber = (digits) => /^\d{10,15}$/.test(digits);
