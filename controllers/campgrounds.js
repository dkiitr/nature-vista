const Campground = require("../models/campground");
const catchAsync = require("../utilis/catchAsync.js");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// to access all campgrounds
module.exports.renderAllCamps = catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// to create new campgrounds
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createNewCamp = catchAsync(async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  const newCampground = new Campground(req.body);
  newCampground.geometry = geoData.body.features[0].geometry;
  newCampground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCampground.author = req.user._id;
  await newCampground.save();
  console.log(newCampground);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${newCampground._id}`);
});

//to access individual campgrounds
module.exports.showCamp = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  // console.log(campground);
  if (!campground) {
    req.flash("error", "Campground Not Found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
});

// to edit campgrounds
module.exports.renderEditForm = catchAsync(async (req, res) => {
  const { id } = req.params;

  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground Not Found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
});

module.exports.updateCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deletedImages) {
    for (let filename of req.body.deletedImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deletedImages } } },
    });
  }
  console.log(campground);
  req.flash("success", "Successfully updated the campground!");
  res.redirect(`/campgrounds/${id}`);
});

//delete Campground
module.exports.deleteCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the campground!");
  res.redirect("/campgrounds");
});
