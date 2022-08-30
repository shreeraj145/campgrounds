const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware")
const Review = require("../models/review");
const Campground = require("../models/campground");

const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/ExpressError");

router.post("/", validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "review posted");
    res.redirect(`/campgrounds/${campground.id}`);
}))

router.delete("/:reviewId", isLoggedin, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted!");
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;