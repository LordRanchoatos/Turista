var express = require("express");
var router    = express.Router();
var passport = require("passport");
var User = require("../models/user");

router. get('/', function(req, res){
    res.render("landing")
});

//----------AUTH ROUTES--------
router.get("/register", function(req, res){
    res.render("register")
});

//handling the register logic
router.post("/register", function(req, res){
    newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to Turista " + user.username);
                res.redirect("./centers");
            })
        }
    });
});

// handling the login logic
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/centers",
        failureredirect: "/login"
    }), function(req, res){

});

//handling the logout logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out"); 
    res.redirect("/centers")
});

//middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;