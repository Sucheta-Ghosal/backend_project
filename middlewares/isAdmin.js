// middlewares/isAdmin.js
module.exports = function isAdmin(req, res, next) {
  if (!req.user) {                       // should already be set by isLoggedIn
    req.flash("error", "Please login first");
    return res.redirect("/");
  }

  const admin =
    (req.user.role && req.user.role.toLowerCase() === "admin") ||
    req.user.isAdmin === true;

  if (!admin) {
    req.flash("error", "Admin access only");
    return res.redirect("/");
  }

  // ✅ user *is* an admin — let the request continue
  return next();
};
