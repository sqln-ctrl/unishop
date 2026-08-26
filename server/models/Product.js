import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: "You can upload a maximum of 5 images",
      },
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Books & Notes",
        "Electronics",
        "Fashion",
        "Accessories",
        "Hostel & Room",
        "Gaming",
        "Study Equipment",
        "Transport",
        "Services",
        "Other",
      ],
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Good", "Fair", "Used"],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
