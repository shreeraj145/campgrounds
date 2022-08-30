const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const { route } = require("./campgrounds");


router.get("/register", (req, res) => {
    res.render("auth/register");
})

router.post("/register", async (req, res) => {
    res.send(req.body);
})

module.exports = router;