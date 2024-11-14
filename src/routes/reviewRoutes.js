const express = require("express");
const router = express.Router();

const { storage } = require('../storage/storage');
const multer = require('multer');
const upload = multer({ storage });

const {
    createReviewCtrl,
    getReviewsCtrl,
    getReviewByIdCtrl,
    updateReviewCtrl,
    deleteReviewCtrl,
    restoreReviewCtrl
} = require("../controllers/reviewController");

// Create a new review
router.post("/", upload.single('image'), createReviewCtrl);
// Get all reviews
router.get("/all", getReviewsCtrl);
// Get a review by ID
router.get("/:id", getReviewByIdCtrl);
// Update a review
router.put("/:id", upload.single('image'), updateReviewCtrl);
// Soft delete a review
router.delete("/:id", deleteReviewCtrl);
// Restore a soft-deleted review
router.patch("/:id/restore", restoreReviewCtrl);

module.exports = router;