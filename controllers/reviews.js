const Campground = require("../models/campground.js");
const Review = require("../models/review.js");
const catchAsync = require("../utilis/catchAsync.js");

module.exports.createReview = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  // console.log(campground);
  // console.log(review);
  req.flash("success", "Successfully created new review!");
  res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.deleteReview = catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
});
