// middlewares/isAdmin.js
module.exports = function isAdmin(req, res, next) {
  // isLoggedIn should already have set req.user
  if (!req.user) {
    req.flash("error", "Please login first");
    return res.redirect("/");
  }

  // Accept either `role: "admin"` or boolean `isAdmin: true`
  const admin =
    (req.user.role && req.user.role.toLowerCase() === "admin") ||
    req.user.isAdmin === true;

  if (admin) {
    return next(); // 🚀 user is an admin — proceed to the route
  }

  // Not an admin
  req.flash("error", "Admin access only");
  return res.redirect("/");
};
