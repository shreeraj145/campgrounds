const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");


const { isLoggedin, isAuthor, validateCampground } = require("../middleware");
const { populate } = require("../models/campground");

router.get("/", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}))

router.get("/new", isLoggedin, catchAsync(async (req, res, next) => {
    res.render("campgrounds/new")
}))

router.post("/", isLoggedin, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user.id;
    await campground.save();
    req.flash("success", "Succesfully made a new campground");
    res.redirect(`/campgrounds/${campground.id}`);
}))


router.get("/:id", catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    console.log(campground);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground });
}))


router.get("/:id/edit", isLoggedin, isAuthor, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground })
}))

router.put("/:id", isLoggedin, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Succesfully updated!");
    res.redirect(`/campgrounds/${campground.id}`)
}))


router.delete("/:id", isLoggedin, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        res.redirect("/campgrounds")
    }
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted!");
    res.redirect("/campgrounds")
}))


module.exports = router;