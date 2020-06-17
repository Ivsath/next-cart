import mongoose from "mongoose";
import shortid from "shortid";

const { String, Number } = mongoose.Schema.Types;

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sku: {
    type: String,
    unique: true,
    default: shortid.generate(),
  },
  description: {
    type: String,
    requiredPaths: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
});

// Check so we dont try to overwrite the model once compiled
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
