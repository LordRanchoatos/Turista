var Center = require("../models/center");
var Comment = require("../models/comment");


var middlewareObj = {};

middlewareObj.checkCenterOwnership = function checkCenterOwnership(req, res, next){
    if(req.isAuthenticated()) {
        Center.findById(req.params.id, function(err, foundCenter){
            if(err){
                req.flash("error", "Center not found");
                res.redirect("back")
            } else {
                if(foundCenter.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have the permisssion to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back")
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!") 
    res.redirect("/login");
};

module.exports = middlewareObj;