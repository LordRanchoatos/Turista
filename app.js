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
    session = require('express-session'),
    MemoryStore = require("memorystore")(session),
    seedDB       = require("./seeds"),
    PORT = process.env.PORT || 3000 ;
    
    require('dotenv').config();

var centerRoute = require('./routes/centers'),
      commentRoute = require('./routes/comments'),
      indexRoute = require('./routes/index');

// Stop disturbing me again
// "mongodb://localhost/turista"
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, 'useUnifiedTopology': true, 'useFindAndModify': false, useCreateIndex: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();   // seed database

//===================
//PASSPORT CONFIGURATION
//===================
app.use(session ({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 //prune expired entries every 24h
}),
    secret: "happy hacking guys",
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

app.listen(PORT, function(){
    console.log("TURISTA server has started.....")
});