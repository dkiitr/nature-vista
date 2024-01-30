const User = require("../models/user");
const catchAsync = require("../utilis/catchAsync");

module.exports.renderRegister = (req, res) => {
  res.render("auth/register");
};

module.exports.registerUser = catchAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registerdUser = await User.register(user, password);
    req.login(registerdUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to NatureVista");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

module.exports.loginRender = (req, res) => {
  res.render("auth/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
  // res.redirect("/campgrounds");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
