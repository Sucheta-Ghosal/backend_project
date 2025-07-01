const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin"); 

if(process.env.NODE_ENV === "development"){
    router.post("/create", async (req, res) => {
       let owners = await ownerModel.find()
       if(owners.length > 0) return res.send(500).send('You dont have permission to create owner')

        let {fullname, email, password} = req.body

       let createdOwner = await ownerModel.create({
        //    fullname: req.body.fullname,
        //    email: req.body.email,
        //    password: req.body.password
           fullname,
           email,
           password
       })

       res.status(201).send(createdOwner)
    })
};

/*router.get("/admin",function(req,res){
    res.send("hey its working");
});*/

router.get("/admin", (req, res) => {
    let success = req.flash("success");
    res.render("createproducts", { success });
});

// routes/ownersRouter.js (or a dedicated admin router)
/*router.get("/products/all", isLoggedIn, isAdmin, async (req, res) => {
  const products = await productModel.find();
  res.render("allproducts", { products, success: req.flash("success"), error: req.flash("error") });
});*/

router.post("/create", async (req, res) => {
  let owners= await ownerModel.find();
  if(owners.length > 0)
  {
    return res.status(403)
              .send("You don't have permission to create a new owner.");
  }

  let { fullname, email, password }=req.body;

  let createdOwner = await ownerModel.create({
    fullname,
    email,
    password
  });
  res.status(201).send("owner created");
});

module.exports = router;