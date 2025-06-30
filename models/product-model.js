const mongoose=require('mongoose');

const productSchema= mongoose.Schema({
    name: String,
    price: Number,
    discount: {
        type: Number,
        defaults: 0
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
    image: String
});

module.exports=mongoose.model("product",productSchema);