export const categories = [
  "Books & Notes", "Electronics", "Fashion", "Accessories", "Hostel & Room",
  "Gaming", "Study Equipment", "Transport", "Services", "Other",
];
export const conditions = ["New", "Like New", "Good", "Fair", "Used"];
export const reportReasons = [
  "Prohibited item", "Misleading listing", "Suspected scam",
  "Inappropriate content", "Spam", "Other",
];
export const reportStatuses = ["pending", "reviewed", "dismissed"];

export const httpError = (status, message) => Object.assign(new Error(message), { status });

export const textField = (value, label, { optional = false, max } = {}) => {
  if (optional && value === undefined) return "";
  if (typeof value !== "string" || (!optional && !value.trim())) {
    throw httpError(400, `${label} is required`);
  }
  const text = value.trim();
  if (max && text.length > max) throw httpError(400, `${label} must be at most ${max} characters`);
  return text;
};

export const enumField = (value, choices, label) => {
  if (!choices.includes(value)) throw httpError(400, `Invalid ${label}`);
  return value;
};

export const emailField = (value) => {
  const email = textField(value, "Email").toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw httpError(400, "Please enter a valid email");
  return email;
};

export const passwordField = (value) => {
  if (typeof value !== "string" || value.length < 6) {
    throw httpError(400, "Password must be at least 6 characters");
  }
  return value;
};

export const adminPasswordField = (value) => {
  if (typeof value !== "string" || value.length < 12 || Buffer.byteLength(value, "utf8") > 72) {
    throw httpError(400, "Admin passwords must be at least 12 characters and at most 72 UTF-8 bytes");
  }
  return value;
};

const priceField = (value) => {
  if ((typeof value !== "number" && typeof value !== "string") || String(value).trim() === "") {
    throw httpError(400, "Price must be a non-negative number");
  }
  const price = Number(value);
  if (!Number.isFinite(price) || price < 0) throw httpError(400, "Price must be a non-negative number");
  return price;
};

export const productData = (body, partial = false) => {
  const data = {};
  const validators = {
    title: (v) => textField(v, "Title", { max: 100 }),
    description: (v) => textField(v, "Description", { max: 2000 }),
    price: priceField,
    category: (v) => enumField(v, categories, "category"),
    condition: (v) => enumField(v, conditions, "condition"),
    whatsapp: (v) => textField(v, "WhatsApp number"),
    location: (v) => textField(v, "Location", { optional: true }),
    images: (v = []) => {
      if (!Array.isArray(v) || v.length > 5 || v.some((image) => typeof image !== "string")) {
        throw httpError(400, "Images must be an array of up to 5 image URLs");
      }
      return v;
    },
  };
  for (const [field, validate] of Object.entries(validators)) {
    if (!partial || body[field] !== undefined) data[field] = validate(body[field]);
  }
  return data;
};

export const productQuery = (query) => {
  const where = { status: enumField(query.status || "available", ["available", "sold"], "status") };
  if (query.search) {
    const search = textField(query.search, "Search");
    where.OR = [{ title: { contains: search } }, { description: { contains: search } }];
  }
  if (query.category) where.category = enumField(query.category, categories, "category");
  if (query.condition) where.condition = enumField(query.condition, conditions, "condition");
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined) where.price.gte = priceField(query.minPrice);
    if (query.maxPrice !== undefined) where.price.lte = priceField(query.maxPrice);
  }
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || !Number.isSafeInteger((page - 1) * limit)) {
    throw httpError(400, "Page must be positive and limit must be between 1 and 100");
  }
  const sortOptions = { price_asc: { price: "asc" }, price_desc: { price: "desc" }, oldest: { createdAt: "asc" } };
  const orderBy = Object.hasOwn(sortOptions, query.sort) ? sortOptions[query.sort] : { createdAt: "desc" };
  return { where, orderBy, page, limit };
};
