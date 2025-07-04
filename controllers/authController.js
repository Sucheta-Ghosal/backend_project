/*
module.exports.loginUser = async function (req, res) {
  const { email, password } = req.body;

  
  let owner = await ownerModel.findOne({ email }); // check owner collection first
  if (owner) {
    const ok = await bcrypt.compare(password, owner.password);
    if (!ok) {
      req.flash("error", "Email or Password incorrect");
      return res.redirect("/");
    }

    // Owner authenticated ✅
    const token = generateToken({ ...owner.toObject(), role: "admin" });
    res.cookie("token", token, { httpOnly: true });
    return res.redirect("/owners/admin");
  }

  
  const user = await userModel.findOne({ email });
  if (!user) {
    req.flash("error", "Email or Password incorrect");
    return res.redirect("/");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    req.flash("error", "Email or Password incorrect");
    return res.redirect("/");
  }

  // Normal user authenticated ✅
  const token = generateToken({ ...user.toObject(), role: "user" });
  res.cookie("token", token, { httpOnly: true });
  res.redirect("/shop");
};
*/



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

//updated code in git

/*
const userModel = require("../models/user-model");
const ownerModel = require("../models/owner-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");


module.exports.registerUser = async (req, res) => {
    try {
        let { email, password, fullname } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) {
            req.flash("error", "You already have an account, please login");
            return res.redirect("/");
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return err.send(err.message);
                else {
                    let user = await userModel.create({
                        email,
                        password: hash,
                        fullname
                    });
                    let token = generateToken(user);
                    res.cookie("token", token); // we are setting the token in the user browser
                    res.send("user created successfully");
                }
            })
        })

    }
    catch (err) {
        res.send(err.message);
    }


}

module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;

    //for owner

    let owner = await ownerModel.findOne({ email: email });
    if (!owner) {
        let user = await userModel.findOne({ email: email });
        if (!user) {
            req.flash("error", "Email or Password incorrect");
            return res.redirect("/");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash("error", "Email or Password incorrect");
            return res.redirect("/");
        }

        //else, if user exists then login her/him

        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let token = generateToken(user);
                res.cookie("token", token);
                res.redirect("/shop");
            }
            else {
                req.flash("error", "Email or Password incorrect!!");
                res.redirect("/");
            }
        })
    }
    else {
        const match = await bcrypt.compare(password, owner.password);
        if (!match) {
            req.flash("error", "Email or Password incorrect");
            return res.redirect("/");
        }

        //else, if admin exists then login her/him

        bcrypt.compare(password, owner.password, function (err, result) {
            if (result) {
                let token = generateToken(owner);
                res.cookie("token", token);
                res.redirect("/owners/admin");
            }
            else {
                req.flash("error", "Email or Password incorrect!!");
                res.redirect("/");
            }
        })
    }
    //
    /*let user = await userModel.findOne({ email: email });
    if (!user) {
        req.flash("error", "Email or Password incorrect");
        return res.redirect("/");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        req.flash("error", "Email or Password incorrect");
        return res.redirect("/");
    }

    //else, if user exists then login her/him

    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token);
            res.redirect("/shop");
        }
        else {
            req.flash("error", "Email or Password incorrect!!");
            res.redirect("/");
        }
    })*/
/*};

module.exports.logoutUser = function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
}
*/

/* controllers/authController.js */
const userModel = require("../models/user-model");
const ownerModel = require("../models/owner-model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

/* ---------- Register (normal user) ---------- */
exports.registerUser = async (req, res) => {
    try {
        let { email, password, fullname } = req.body;
        email = email.toLowerCase();

        if (await userModel.findOne({ email })) {
            req.flash("error", "You already have an account, please login");
            return res.redirect("/");
        }

        const hash = await bcrypt.hash(password, 12);
        const user = await userModel.create({
            email,
            password: hash,
            fullname,
            role: "user"
        });

        const token = generateToken(user);
        res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
        return res.redirect("/shop");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

/* ---------- Login (owner OR user) ---------- */
/*exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        //email = email.toLowerCase();

        //1️⃣  Look for an owner first 
        let owner = await ownerModel.findOne({ email: email });
        let redirectTo = "/owners/admin";

        // 2️⃣  If not an owner, look for a normal user 
        if (!owner) {
            user = await userModel.findOne({ email: email });
            redirectTo = "/shop";
        }

        if (!user) {
            req.flash("error", "Email or Password incorrect");
            return res.redirect("/");
        }

        // 3️⃣  Verify password 
        if (owner) {
            try {
                const ok = await bcrypt.compare(password, owner.password);
                if (!ok) {
                    req.flash("error", "Email or Password incorrect");
                    return res.redirect("/");
                }

                // 4️⃣  Issue token & redirect 
                const token = generateToken(owner);
                res.cookie("token", token);
                return res.redirect("/owners/admin");
            } catch (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
        }
        else if (user) {
            try {
                const ok = await bcrypt.compare(password, user.password);
                if (!ok) {
                    req.flash("error", "Email or Password incorrect");
                    return res.redirect("/");
                }

                // 4️⃣  Issue token & redirect 
                const token = generateToken(user);
                res.cookie("token", token);
                return res.redirect("/shop");
            } catch (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
        }
        else{
            req.flash("error", "No such user exists,Register please..");
            return res.redirect("/");
        }

    }
    catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}*/
exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();          // 1️⃣  normalise once

    /* 2️⃣  Try owner first, fall back to user */
    const owner = await ownerModel.findOne({ email });
    const user  = owner ? null : await userModel.findOne({ email });
    //console.log(user);
    if (!owner && !user) {
      req.flash("error", "Email or Password incorrect neither user nor owner");
      return res.redirect("/");
    }

    const account     = owner ? owner :user ;
    //console.log(account);   
    const redirectTo  = owner ? "/owners/admin" : "/shop";
    //console.log(password);
    
    /* 3️⃣  Verify password */
    const match = await bcrypt.compare(password, account.password);
    //console.log(match);
    if (!match) {
      req.flash("error", "Email or Password incorrect (password)");
      return res.redirect("/");
    }

    /* 4️⃣  Sign token & redirect */
    const token = generateToken(account);
    res.cookie("token", token,{ httpOnly: true, sameSite: "lax" });
    return res.redirect(redirectTo);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};


/* ---------- Logout ---------- */
exports.logoutUser = (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
};
