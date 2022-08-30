const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware")
const Review = require("../models/review");
const Campground = require("../models/campground");
const reviews = require("../controllers/reviews")
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/ExpressError");

router.post("/", validateReview, catchAsync(reviews.createReview))

router.delete("/:reviewId", isLoggedin, isReviewAuthor, catchAsync(reviews.deleteReviews))

module.exports = router;