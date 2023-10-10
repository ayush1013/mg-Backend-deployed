const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  address: {
    type: String,
  },
  state: {
    type: String,
  },
  postal_code: {
    type: Number,
  },
  country: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  category: {
    type: String,
    default: "User",
  },
  gender: {
    type: String,
  },
});

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;
