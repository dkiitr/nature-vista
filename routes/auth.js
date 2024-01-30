const express = require("express");
const router = express.Router();
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const {
  login,
  renderRegister,
  registerUser,
  loginRender,
  logout,
} = require("../controllers/auth");

router.route("/register").get(renderRegister).post(registerUser);

router
  .route("/login")
  .get(loginRender)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    login
  );

router.route("/logout").get(logout);

module.exports = router;
