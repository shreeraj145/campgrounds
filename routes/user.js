const express = require("express");
const user = require("../models/user");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { route } = require("./campgrounds");
const passport = require("passport");
const users = require("../controllers/users");


router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.makeUser))

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", keepSessionInfo: true }), users.login)

router.get("/logout", users.logout);


module.exports = router;