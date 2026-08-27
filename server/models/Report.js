import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "Prohibited item",
        "Misleading listing",
        "Suspected scam",
        "Inappropriate content",
        "Spam",
        "Other",
      ],
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;