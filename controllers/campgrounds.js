const Campground = require("../models/campground");


module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}


module.exports.renderNewForm = async (req, res, next) => {
    res.render("campgrounds/new")
}


module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user.id;
    await campground.save();
    console.log(campground)
    req.flash("success", "Succesfully made a new campground");
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground });
}

module.exports.renderEditForm = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground })
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Succesfully updated!");
    res.redirect(`/campgrounds/${campground.id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        res.redirect("/campgrounds")
    }
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted!");
    res.redirect("/campgrounds")
}