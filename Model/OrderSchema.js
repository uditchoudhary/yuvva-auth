const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: false,
    unique: true,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  OrderTotal: {
    type: Number,
    required: true,
  },
  orderItem: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
