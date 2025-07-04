/*const mongoose=require('mongoose');

const userSchema= mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true
    },
    email: String,
    password: String,
    cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  orders:
    {
      type: Array,
      default: [],
    },
    contact: Number,
    picture: String
});

module.exports=mongoose.model("user",userSchema);
*/

/* models/user-model.js */
const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    minlength: 3,
    trim: true,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true            // makes queries case‑insensitive
  },

  password: {
    type: String,
    required: true
  },

  /* 👇 new field: every regular user carries role = "user" */
  role: {
    type: String,
    default: "user",
    enum: ["user"]
  },

  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product"
    }
  ],

  orders: {
    type: Array,
    default: []
  },

  contact: Number,
  picture: String
});

/* Hash the password before saving (only when it’s modified) */
/*userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});*/

module.exports = mongoose.model("user", userSchema);
