if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}




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
const mongoSanitize = require('express-mongo-sanitize');
const User = require("./models/user");
const helmet = require("helmet")




const userRoutes = require("./routes/user");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const MongoStore = require('connect-mongo');



const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/Yelp-camp'

mongoose.connect(dbUrl)
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

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/db9bosujb/",
    "https://events.mapbox.com/events"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/db9bosujb/",
    "https://events.mapbox.com/events"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/db9bosujb/",
    "https://events.mapbox.com/events"
];
const fontSrcUrls = ["https://res.cloudinary.com/db9bosujb/"];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/db9bosujb/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
            mediaSrc: ["https://res.cloudinary.com/db9bosujb/"],
            childSrc: ["blob:"]
        }
    })
);
app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }));


const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60
});



store.on("error", function (e) {
    console.log("session store error", e);
})

const sessionConfig = {
    store: store,
    name: "session",
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize({ replaceWith: '_' }));
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