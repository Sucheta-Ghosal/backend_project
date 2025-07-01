const express = require("express");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const router = express.Router();
const flash = require("connect-flash");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", function (req, res) {
  let error= req.flash("error");
  res.render("index", { error, isLoggedIn: false });
});

router.get("/shop",isLoggedIn,async function (req, res) {
  let products = await productModel.find();
  let success = req.flash("success");
  res.render("shop", { products, success });
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
  // console.log(req.user);
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Added to cart");
  res.redirect("/shop");
});

router.get("/cart", isLoggedIn, async (req, res, next) => {
  try {
    // 1) grab the logged‑in user and populate the products inside cart
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("cart");              // cart now holds full product docs

    if (!user) {
      req.flash("error", "Please log in first");
      return res.redirect("/");
    }


    // BILL :  Each item:  base price + platform fee (20) – discount
    const platformFee = 20;
    const bill = (Number(user.cart[0].price)+platformFee - Number(user.cart[0].discount))


    res.render("cart", { user, bill });
  } catch (err) {
    next(err);             
    }
});

router.get("/account", isLoggedIn, async (req, res, next) => {
  try {
    // Fetch the current user by email (or by _id if you store that)
    const user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/");
    }

    res.render("account", { user });
  } catch (err) {
    next(err);
  }
});


/*router.get("/cart", isLoggedIn, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

    const bill = (Number(user.cart[0].price)+20 - Number(user.cart[0].discount))
    
    res.render("cart");
  //res.render("cart", { user, bill });
});*/

/*router.post("/register",async function(req,res){
    try{
        let { email, password, fullname }=req.body;

        let user = await userModel.create({
            email,
            password,
            fullname
        });
        res.send(user);
    }
    catch(err)
    {
        console.log(err.message);
    }
})
*/
/*router.get("/shop", isLoggedIn, async function (req, res) {
  let products = await productModel.find();
  let success = req.flash("success");
  res.render("shop", { products, success });
});



router.get("/logout", isLoggedIn, function (req, res) {
  res.render("shop");
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
  // console.log(req.user);
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Added to cart");
  res.redirect("/shop");
});*/



module.exports = router;