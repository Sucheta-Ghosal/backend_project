/*
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async (req, res, next) => {
    if (!req.cookies.token) {
        req.flash("error", "You need to login first");
        return res.redirect("/");
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/");
        }

        req.user = user;
        next();
    } catch (err) {
        req.flash("error", "You need to login first");
        return res.redirect("/");
    }
};*/

//updated code in git

/*
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async (req, res, next) => {
    if(!req.cookies.token) {
        req.flash("error", "You need to login first");
        return res.redirect("/"); 
    }

    try{
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel.findOne({email: decoded.email})
                                 .select("-password");//decoded message will contain email and password, so remove the password

        req.user = user; //created a user field in request

        next();
    }
    catch(err){
        req.flash("error", "Something went wrong !!");
        res.redirect("/");
    }
};

*/

/* middleware/isLoggedIn.js */
const jwt        = require("jsonwebtoken");
const userModel  = require("../models/user-model");
const ownerModel = require("../models/owner-model");

module.exports = async (req, res, next) => {
  try {
    /* 1️⃣  Must have a token cookie */
    const { token } = req.cookies;
    if (!token) {
      req.flash("error", "You need to log in first");
      return res.redirect("/");
    }

    /* 2️⃣  Verify & decode the JWT */
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // decoded = { id, email, role, iat, exp }

    /* 3️⃣  Fetch the account from the proper collection */
    let account;
    if (decoded.role === "admin") {
      account = await ownerModel.findById(decoded.id).select("-password");
    } else {
      account = await userModel.findById(decoded.id).select("-password");
    }

    if (!account) {
      req.flash("error", "Account no longer exists");
      return res.redirect("/");
    }

    /* 4️⃣  Attach to req for downstream handlers */
    req.user  = account;        // full doc minus password
    req.role  = decoded.role;   // convenience flag

    next();
  } catch (err) {
    console.error(err);
    req.flash("error", "You need to log in first");
    res.redirect("/");
  }
};
