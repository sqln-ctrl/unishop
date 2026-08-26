import Product from "../models/Product.js";

// @desc    Get all products (with search, filter, sort)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, condition, minPrice, maxPrice, sort, status } = req.query;

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (status) query.status = status;
    else query.status = "available";

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("seller", "name university profileImage")
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by id
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name university profileImage email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.views += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product listing
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, condition, location } = req.body;
    const files = req.files || [];

    if (!title || !description || !price || !category || !condition) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    if (files.length > 5) {
      return res.status(400).json({ message: "You can upload a maximum of 5 images" });
    }

    const images = files.map((file) => `/uploads/${file.filename}`);

    const product = await Product.create({
      title,
      description,
      price,
      images,
      category,
      condition,
      location,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product listing
// @route   PUT /api/products/:id
// @access  Private (owner only)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this listing" });
    }

    const fields = ["title", "description", "price", "category", "condition", "location"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product listing
// @route   DELETE /api/products/:id
// @access  Private (owner only)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await product.deleteOne();
    res.json({ message: "Listing removed" });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a product as sold
// @route   PATCH /api/products/:id/sold
// @access  Private (owner only)
export const markAsSold = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    product.status = "sold";
    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
};
