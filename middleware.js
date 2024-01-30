const ExpressError = require("./utilis/ExpressError")
const {campgroundJoiSchema, reviewJoiSchema} = require("./joi-schema")
const Campground = require("./models/campground")
const Review = require("./models/review")

//Checking LoggedIn Status
// module.exports.isLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         req.session.returnTo = req.originalUrl; 
//         req.flash("error", "You must be Signed in first!");
//         res.redirect("/login");
//     }
//     next();
// };

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    else {
        next();
    }
}

// Redirect URL
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

// server side input validations for campground
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// To check the campground owner
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to edit");
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}

// server side input validation for Review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

//to check review owner
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to edit");
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}