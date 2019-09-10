var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", (req, res) => {
	res.render("landing");
});

//===========
//AUTH ROUTES
//===========

router.get("/register", (req, res) => {
	res.render("register");
});

//handle sign up logic
router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			req.flash("error", err.message);
			return res.redirect("/register"); //CHANGED FROM res.render to res.redirect to get the flash functionality
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "You have successfully registered");
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", (req, res) => {
	res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), (req, res) => {
	//empty callback function
});

//logout route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You have been logged out");
	res.redirect("/campgrounds");
});

module.exports = router;