const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware.js");
const {
  renderAllCamps,
  createNewCamp,
  deleteCampground,
  renderEditForm,
  showCamp,
  renderNewForm,
  updateCampground,
} = require("../controllers/campgrounds.js");

router
  .route("/")
  .get(renderAllCamps)
  .post(isLoggedIn, upload.array("image"), validateCampground, createNewCamp);
// .post(upload.array("image"), (req, res) => {
//   console.log(req.body, req.files)
//   res.send("all good");
// });
router.route("/new").get(isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(showCamp)
  .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, updateCampground)
  .delete(isLoggedIn, isAuthor, deleteCampground);

router.route("/:id/edit").get(isLoggedIn, isAuthor, renderEditForm);

module.exports = router;
