var express = require("express");
var router    = express.Router();
var Center = require("../models/center");
var middleware = require("../middleware");

router.get("/", function(req, res){
    Center.find({}, function(err, centers){
        if(err){
            console.log(err)
        } else {
            res.render("./centers/index", { centers: centers })
        }
    })
});


//password == nyo1FDgcpJl5KKn8
//  database mongodb+srv://turista:<password>@ranchoatos.p1iml.mongodb.net/<dbname>?retryWrites=true&w=majority

//handles the creation of new center
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form 
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCenter = { name: name, price: price, image: image, description: description, author: author };
    Center.create(newCenter, function(err, newCenter){
        if (err){
            console.log(err)
        } else {
            //redirect to centers page
            req.flash("success", "Center successfully created! ")
            res.redirect("/centers");
        }
    })
});

// get the form to create new center
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("./centers/new.ejs")
});

// show selected center
router.get('/:id', function(req, res){
    Center.findById(req.params.id).populate("comments").exec(function(err, foundCenter){
        if(err){
            console.log(err)
        } else {
            res.render("./centers/show", { center: foundCenter })
        }
    });
});

//center edit route 
router.get("/:id/edit", middleware.checkCenterOwnership, function(req, res){
    Center.findById(req.params.id, function(err, foundCenter){
        res.render("centers/edit", { center: foundCenter })
    })
});

//handle the update route
router.put("/:id", middleware.checkCenterOwnership, function(req, res){
    Center.findByIdAndUpdate(req.params.id, req.body.center, function(err, upDatedCenter){
        if(err){
            res.redirect("/center")
        } else {
            res.redirect("/centers/" + req.params.id)
        }
    });
});

//center delete route
router.delete("/:id", middleware.checkCenterOwnership, function(req, res){
    Center.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/centers")
        } else {
            res.redirect("/centers")
        }
    })
}); 


module.exports = router;