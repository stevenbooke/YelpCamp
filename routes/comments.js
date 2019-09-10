var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");
//===============
//COMMENTS ROUTES
//===============

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, (err, newComment) => {
				if(err) {
					console.log(err);
				} else {
					//add username and id to comment
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					//save comment
					newComment.save();
					campground.comments.push(newComment);
					campground.save();
					req.flash("success", "Comment successfully added to Campsite");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

//EDIT COMMENT
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", { comment : foundComment, campgroundId : req.params.id });
		}
	});
});

//UPDATE COMMENT
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		foundComment.text = req.body.comment.text;
		foundComment.save();
		res.redirect("/campgrounds/" + req.params.id);
	});
});

//DESTROY ROUTE

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment has been deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;