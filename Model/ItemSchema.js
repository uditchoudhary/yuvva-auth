const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
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
    type: Number,
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
  isOnDeal: {
      type: Boolean,
      required: false
  }
});

module.exports = mongoose.model("Item", ItemSchema);
