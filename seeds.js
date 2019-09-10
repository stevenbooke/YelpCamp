var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
		name: "Yosemite",
		image: "https://i.pinimg.com/736x/77/57/ae/7757aedf96d104a6c646e1be95472f7d.jpg",
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
		name: "Big Sur",
		image: "https://campone.com/wp-content/uploads/2017/12/Kirk-Creek-Campground-Tent-and-Sunset.jpg",
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
		name: "Yellowstone",
		image: "https://i.pinimg.com/originals/f7/ce/cc/f7cecc78598dafe9177fdff2fbf93795.jpg",
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	}
];

function seedDB() {
	//REMOVE ALL CAMPGROUNDS
	Campground.deleteMany({}, (err) => {
		if(err) {
			console.log(err);
		} else {
			console.log("Campgrounds have been removed");
			//ADD A FEW CAMPGROUNDS
			data.forEach((seed) => {
				Campground.create(seed, (err, seed) => {
					if(err) {
						console.log(err);
					} else {
						console.log("Campground added");
						Comment.create(
							{
								text: "This place is great but I wish there was internet",
							 	author: "Steven"
							}, (err, comment) => {
								seed.comments.push(comment);
								seed.save();
								console.log("Comment created");
						});
					}
				});
			});
		}
	});
			
	//ADD A FEW COMMENTS
};

module.exports = seedDB;