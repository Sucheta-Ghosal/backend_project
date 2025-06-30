const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateToken");


module.exports.registerUser = async (req, res) => {
    try {
        let { email, password, fullname } = req.body;

        let user = await userModel.findOne({email: email});
        if(user) return res.status(401).send("You already have an account, please Login");

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return err.send(err.message);
                else {
                    let user = await userModel.create({
                        email,
                        password:hash,
                        fullname
                    });
                    let token = generateToken(user);
                    res.cookie("token",token); // we are setting the token in the user browser
                    res.send("user created successfully");
                }
            })
        })

    }
    catch (err) {
        res.send(err.message);
    }


}

module.exports.loginUser = async function (req,res) {
    let {email, password}=req.body;
    
    let user = await userModel.findOne({email: email});
    if(!user) return res.send("Email or Password incorrect!!");

    //else, if user exists then login her/him

    bcrypt.compare(password, user.password, function(err, result){
        if(result)
        {
            let token = generateToken(user);
            res.cookie("token",token);
            res.redirect("/shop");
        }
        else{
            return res.send("Email or Password incorrect!!");
            res.redirect("/");
        }
    })
};

/*module.exports.loginUser = async function (req, res) {
    let {email, password} = req.body;

    let user = await userModel.findOne({email: email})
    if(!user){
        req.flash("error", "Email or Password is incorrect");
        return res.redirect("/");
    };

    bcrypt.compare(password, user.password, (err, result) => {
        if(result){
            let token = generateToken(user);
            console.log(token);
            res.cookie("token", token);
            res.redirect("/shop");
        }
        else{
            req.flash("error", "Email or Password is incorrect");
            return res.redirect("/");
        }
    })
};

module.exports.logoutUser = function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
}

function (req, res) {
    try {
        let { email, password, fullname } = req.body;

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return err.send(err.message);
                else {
                    let user = await userModel.create({
                        email,
                        password:hash,
                        fullname
                    });
                    let token = generateToken(user);
                    res.cookie("token",token); // we are setting the token in the user browser
                    res.send("user created successfully");
                }
            })
        })

    }
    catch (err) {
        res.send(err.message);
    }
}*/