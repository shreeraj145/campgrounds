const express = require("express");
const user = require("../models/user");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { route } = require("./campgrounds");
const passport = require("passport");


router.get("/register", (req, res) => {
    res.render("auth/register");
})

router.post("/register", catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash("success", "Welcome to yelpcamp!");
        res.redirect("/campgrounds");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register")
    }

}))

router.get("/login", (req, res) => {
    res.render("auth/login")
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), async (req, res) => {
    req.flash("success", "Welcome back");
    res.redirect("/campgrounds")
})


router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash("success", "Logged out")
        res.redirect("/campgrounds");
    });
})
module.exports = router;