/*const jwt = require("jsonwebtoken");

function generateToken(user) {
  const secret = process.env.JWT_SECRET;          // <- use JWT_SECRET consistently
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.sign(
    { email: user.email, id: user._id },
    secret,
    { expiresIn: "7d" }                          // token valid for 7 days
  );
}

module.exports = { generateToken };*/


//updated one in git
/*
const jwt = require('jsonwebtoken');

//user details are sent to this function

const generateToken = (user)=>{
    return jwt.sign({ email: user.email, id:user._id},process.env.JWT_KEY);
};
module.exports.generateToken = generateToken;
*/


/* utils/generateToken.js */
const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT for a user OR owner document.
 * Payload: { id, email, role }
 */
function generateToken(account) {
  const secret = process.env.JWT_KEY;           // define in .env
  if (!secret) throw new Error("JWT_KEY not set in environment");

  return jwt.sign(
    {
      id:    account._id.toString(),
      email: account.email,
      role:  account.role                       // "admin" | "user"
    },
    secret,
    { expiresIn: "7d" }                         // 7‑day validity
  );
}

module.exports = { generateToken };
