const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require("../middleware.js");

const { createReview, deleteReview } = require("../controllers/reviews");

// adding review Route
router.post("/", isLoggedIn, validateReview, createReview);

//delete review  route

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, deleteReview);

module.exports = router;
