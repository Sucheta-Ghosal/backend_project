/*const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async (req, res) => {
    try{

        let { name, price, discount, bgcolor, panelcolor, textcolor } =
          req.body;
      
        let product = await productModel.create({
          image: req.file.buffer,
          name,
          price,
          discount,
          bgcolor,
          panelcolor,
          textcolor,
        });
      
        req.flash("success", "Product created successfully");
        res.redirect("/owners/admin");
    }
    catch(err){
        res.send(err.message)
    }
});

module.exports = router;
*/

const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");


  router.post("/create", upload.single("image"), async (req, res) => {
    try {let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

    let product = await productModel.create({
      image: req.file.buffer,
      name, price, discount, bgcolor, panelcolor, textcolor
    });
    req.flash("success", "Product created successfully");
    res.redirect("/owners/admin");
  }
  catch (err) {
    res.send(err.message);
  }
});



/*router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

    // build the document
    const productData = { name, price, discount, bgcolor, panelcolor, textcolor };
    if (req.file) {
      productData.image = req.file.buffer;    // only add if file exists
      //productData.image = bag4;
    }

    const product = await productModel.create(productData);

    req.flash("success", "Product created successfully");
    res.redirect("/owners/admin");    
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});*/

router.get("/all", async (req, res) => {
  try {
    const products = await productModel.find();

    res.render("allproducts", {
      products,
      success: req.flash("success"),
      error: req.flash("error")
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/*router.get(
  "/edit/:id",
  // isLoggedIn, isAdmin,
  async (req, res) => {
    try {
      const product = await productModel.findById(req.params.id);
      if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/products/all");
      }

      res.render("editproducts", {
        product,
        success: req.flash("success"),
        error: req.flash("error")
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Something went wrong");
      res.redirect("/products/all");
    }
  }
);
*/
router.get("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

    const update = { name, price, discount, bgcolor, panelcolor, textcolor };
    //if (req.file) update.image = bag4.png;
    if (req.file) update.image = req.file.buffer;

    await productModel.findByIdAndUpdate(req.params.id, update);
    req.flash("success", "Product updated successfully");


    res.redirect("/products/all");
  } catch (err) {
    console.error(err);
    req.flash("error", "Error updating product");
    res.redirect("/products/all");
  }
});


router.get(
  "/delete/:id",
  // isLoggedIn, isAdmin,      // <- optional protection
  async (req, res) => {
    try {
      await productModel.findByIdAndDelete(req.params.id);
      req.flash("success", "Product deleted");
      res.redirect("/products/all");
    } catch (err) {
      console.error(err);
      req.flash("error", "Could not delete product");
      res.redirect("/products/all");
    }
  }
);

module.exports = router;

