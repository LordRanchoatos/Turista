var express     = require("express"),
    app            = express(),
    bodyParser      = require("body-parser"),
    mongoose       = require("mongoose"),
    passport          = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy   = require("passport-local"),
    flash                = require("connect-flash"),
    User                 = require("./models/user"),
    Center         = require("./models/center"),
    Comment = require("./models/comment"),
    seedDB       = require("./seeds");

var centerRoute = require('./routes/centers'),
      commentRoute = require('./routes/comments'),
      indexRoute = require('./routes/index');



mongoose.connect("mongodb://localhost/turista");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();   // seed database

//===================
//PASSPORT CONFIGURATION
//===================
app.use(require("express-session")({
    secret: "You can do anything if you put your mind to it",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next()
});

app.use(indexRoute);
app.use("/centers", centerRoute);
app.use( "/centers/:id/comments", commentRoute);

app.listen(3000, function(){
    console.log("TURISTA server has started.....")
});