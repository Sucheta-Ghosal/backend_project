const jwt = require("jsonwebtoken");

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

module.exports = { generateToken };
