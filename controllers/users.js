const User = require("../models/user");


module.exports.renderRegister = (req, res) => {
    res.render("auth/register");
}

module.exports.makeUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Escapology!");
            res.redirect("/campgrounds");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register")
    }

}

module.exports.renderLogin = (req, res) => {
    res.render("auth/login")
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash("success", "Logged out")
        res.redirect("/campgrounds");
    });
}