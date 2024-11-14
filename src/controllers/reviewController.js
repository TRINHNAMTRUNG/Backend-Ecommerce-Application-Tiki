const {
    createReviewSvc,
    getAllReviewsSvc,
    getReviewByIdSvc,
    updateReviewSvc,
    deleteReviewSvc,
    uploadReviewImageSvc,
    restoreReviewSvc,
} = require("../services/reviewService");

const { formatResBodySuscess, formatResBodyFailed } = require("./fomatResponse");
const cloudinary = require('cloudinary').v2;

// Create Review
const createReviewCtrl = async(req, res) => {
    let dataReview = req.body;

    try {
        // Upload image if provided
        if (req.file && req.file.path) {
            const uploadedImage = await uploadReviewImageSvc(req.file.path);
            dataReview = {...dataReview, image: uploadedImage.secure_url };
        }

        const newReview = await createReviewSvc(dataReview);
        return res.status(201)
            .json(formatResBodySuscess(true, "Review created successfully", newReview));
    } catch (error) {
        // Delete uploaded image if review creation fails
        if (req.file && req.file.path) {
            await cloudinary.uploader.destroy(req.file.filename);
        }

        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Failed to create review", error.message));
    }
};

// Get All Reviews
const getReviewsCtrl = async(req, res) => {
    try {
        const reviews = await getAllReviewsSvc();
        return res.status(200)
            .json(formatResBodySuscess(true, "Fetched reviews successfully", reviews));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Failed to fetch reviews", error.message));
    }
};

// Get Review by ID
const getReviewByIdCtrl = async(req, res) => {
    try {
        const reviewId = req.params.id;

        if (!reviewId) {
            return res.status(400)
                .json(formatResBodyFailed(false, "Review ID is required"));
        }

        const review = await getReviewByIdSvc(reviewId);
        return res.status(200)
            .json(formatResBodySuscess(true, "Fetched review successfully", review));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Failed to fetch review", error.message));
    }
};

// Update Review
const updateReviewCtrl = async(req, res) => {
    let dataReview = req.body;

    try {
        // Upload new image if provided
        if (req.file && req.file.path) {
            const uploadedImage = await uploadReviewImageSvc(req.file.path);
            dataReview = {...dataReview, image: uploadedImage.secure_url };
        }

        const updatedReview = await updateReviewSvc(dataReview);
        return res.status(200)
            .json(formatResBodySuscess(true, "Review updated successfully", updatedReview));
    } catch (error) {
        if (req.file && req.file.path) {
            await cloudinary.uploader.destroy(req.file.filename);
        }

        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Failed to update review", error.message));
    }
};

// Soft Delete Review
const deleteReviewCtrl = async(req, res) => {
    try {
        const reviewId = req.params.id;

        if (!reviewId) {
            return res.status(400)
                .json(formatResBodyFailed(false, "Review ID is required"));
        }

        const deletedReview = await deleteReviewSvc(reviewId);
        return res.status(200)
            .json(formatResBodySuscess(true, "Review deleted successfully", deletedReview));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Failed to delete review", error.message));
    }
};

// Restore Review
const restoreReviewCtrl = async(req, res) => {
    try {
        const reviewId = req.params.id;

        if (!reviewId) {
            return res.status(400)
                .json(formatResBodyFailed(false, "Review ID is required"));
        }

        const restoredReview = await restoreReviewSvc(reviewId);
        return res.status(200)
            .json(formatResBodySuscess(true, "Review restored successfully", restoredReview));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Failed to restore review", error.message));
    }
};

// Export Controllers
module.exports = {
    createReviewCtrl,
    getReviewsCtrl,
    getReviewByIdCtrl,
    updateReviewCtrl,
    deleteReviewCtrl,
    restoreReviewCtrl
};