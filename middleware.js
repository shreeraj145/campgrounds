module.exports.isLoggedin = (req, res, next) => {
    console.log(req.user)
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in");
        return res.redirect("/login");
    }
    next();
}