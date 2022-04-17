const mongoose = require("mongoose");
const Item = require("./ItemSchema");

const CartItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  _id: {
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
    require: true
  }
});

module.exports = mongoose.model("Cart", CartSchema);
