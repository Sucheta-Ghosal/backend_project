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
const router  = express.Router();
const upload  = require("../config/multer-config");
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

    // build the document
    const productData = { name, price, discount, bgcolor, panelcolor, textcolor };
    if (req.file) {
      productData.image = req.file.buffer;    // only add if file exists
    }

    const product = await productModel.create(productData);

    req.flash("success", "Product created successfully");
    res.redirect("/owners/admin");            // or res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;

