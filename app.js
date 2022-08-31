if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

console.log(process.env.secret)

const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const flash = require("connect-flash")
const session = require("express-session");
const expressError = require("./utils/ExpressError");
const methodOverride = require('method-override');
const passport = require("passport");
const localStratergy = require("passport-local");
const User = require("./models/user")




const userRoutes = require("./routes/user");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");




mongoose.connect('mongodb://localhost:27017/Yelp-camp')
    .then(() => {
        console.log("DATABASE CONNECTED");
    })
    .catch(err => {
        console.log("OH NO Mongo connection ERROR!!!!");
        console.log(err);
    })


const app = express();



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));



const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})



app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);


app.get("/", (req, res) => {
    res.render("home")
})


app.all("*", (req, res, next) => {
    next(new expressError("Page not found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) { err.message = "Oh no, something went wrong" }
    res.status(statusCode).render("error", { err });
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})