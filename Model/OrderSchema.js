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
const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: false,
  },
  userId: {
    type: String,
    required: false,
    unique: false,
  },
  orderDate: {
    type: String,
    required: true,
  },
  orderTotal: {
    type: Number,
    required: true,
  },
  orderItem: [{
    type: CartItemSchema,
    required: true,
  }],
  txnStatus: {
    type: String,
    required: true,
  },
  bank: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
