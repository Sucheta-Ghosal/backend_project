/*const mongoose=require('mongoose');

const ownerSchema= mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true
    },
    email: String,
    password: String,
    products: {
        type: Array,
        defaults: []
    },
    picture: String,
    gstin: String
});

module.exports=mongoose.model("owner",ownerSchema);
*/

/* models/owner-model.js */
const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");

const ownerSchema = new mongoose.Schema({
  fullname: { type: String, required: true, trim: true, minlength: 3 },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  products: { type: Array,  default: [] },
  picture:  String,
  gstin:    String,
  role:     { type: String, default: "admin", enum: ["admin"] } // always admin
});

/* Hash password before save */
ownerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("owner", ownerSchema);
