var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

//INDEX - SHOW ALL CAMPGROUNDS
router.get("/campgrounds", (req, res) => {
	Campground.find({}, (err, campGrounds) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campGrounds : campGrounds, currentUser: req.user});
		}
	});
});

//CREATE - ADD NEW CAMPGROUND TO DB
router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
	var newCampSite = {};
	newCampSite.name = req.body.campSite;
	newCampSite.image = req.body.imageURL;
	newCampSite.description = req.body.description;
	newCampSite.price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	newCampSite.author = author;
	Campground.create(newCampSite, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
				res.redirect("/campgrounds");
		}
	});
});

//NEW - SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new.ejs");
});

//SHOW - SHOWS MORE INFO ABOUT ONE CAMPGROUND
router.get("/campgrounds/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campGround : foundCampground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground : foundCampground});
	});
});

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			console.log(err);
			res.redirect("/campgounds");
		} else {
			foundCampground.name = req.body.campSite;
			foundCampground.image = req.body.imageURL;
			foundCampground.description = req.body.description;
			foundCampground.price = req.body.price;
			foundCampground.save();
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//MY OWN VERSION THAT DELETES COMMNETS FROM DB TOO
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			for(var i = 0; i < foundCampground.comments.length; i++) {
				Comment.findByIdAndRemove(foundCampground.comments[i], (err) => {
					if(err) {
						console.log(err);
					} else {
						console.log("Comment should be removed from database");
					}
				});
			}
			foundCampground.comments = [];
			foundCampground.save();
			console.log(foundCampground.comments);
			Campground.findByIdAndRemove(req.params.id, (err) => {
				if (err) {
					console.log(err);
					res.redirect("/campgrounds")
				} else {
					res.redirect("/campgrounds");
				}
			});
		}
	});
});

//DESTROY CAMPGROUND ROUTE
// router.delete("/campgrounds/:id", (req, res) => {
// 	Campground.findByIdAndRemove(req.params.id, (err) => {
// 		if (err) {
// 			console.log(err);
// 			res.redirect("/campgrounds")
// 		} else {
// 			res.redirect("/campgrounds");
// 		}
// 	});
// });

module.exports = router;