const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds")

const { isLoggedin, isAuthor, validateCampground } = require("../middleware");
const { populate } = require("../models/campground");

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedin, validateCampground, catchAsync(campgrounds.createCampground))

router.get("/new", isLoggedin, catchAsync(campgrounds.renderNewForm))


router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedin, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedin, isAuthor, catchAsync(campgrounds.deleteCampground))


router.get("/:id/edit", isLoggedin, isAuthor, catchAsync(campgrounds.renderEditForm))






module.exports = router;