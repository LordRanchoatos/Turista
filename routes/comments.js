var express = require("express");
var router    = express.Router({mergeParams: true });
var Center = require("../models/center");
var Comment = require("../models/comment");
var middleware = require("../middleware");



router.get('/new', middleware.isLoggedIn, function(req, res){
    Center.findById(req.params.id, function(err, center){
        if(err){
            console.log(err);
        } else {
            res.render("./comments/new", { center: center })
        }
    });
});


//route to create new comment
router.post("/", middleware.isLoggedIn, function(req, res){
    Center.findById(req.params.id, function(err, center){
        if(err) {
            console.log(err);
            res.redirect('/centers');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    center.comments.push(comment);
                    center.save();
                    req.flash("success", "Comment successfully added")
                    res.redirect("/centers/" + center._id )
                }
            });
        }
    });
}); 

//comment edit route to get the edit form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
            console.log(err)
        } else {
            res.render("comments/edit", {center_id: req.params.id, comment: foundComment })
        }
    });
});

// this route handles the editting logic
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "comment successfully editted")
            res.redirect("/centers/" + req.params.id);
        }
    })
});

//delete comment route
router.delete("/:comment_id", function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err) {
            req.flash("success", "Comment successfully deleted")
            res.redirect("back");
        } else {
            res.redirect("/centers/" + req.params.id);
        }
    });
});


module.exports = router;