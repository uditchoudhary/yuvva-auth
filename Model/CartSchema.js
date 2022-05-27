const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: true,
  },
  item_id: {
    type: Number,
    required: true,
  },
  productCategory_name: {
    type: String,
    required: true,
  },
  category_name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false,
    unique: true,
  },
  itemList: [
    {
      type: CartItemSchema,
      required: true,
    },
  ],
  total: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
