const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  line1: {
    type: String,
    required: false,
  },
  line2: {
    type: String,
    required: false,
  },
  line3: {
    type: String,
    required: false,
  },
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: AddressSchema,
    required: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
