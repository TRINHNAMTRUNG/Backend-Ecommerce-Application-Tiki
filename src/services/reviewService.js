const Review = require("../models/review");
const joi = require("joi");
const { isValidObjectId } = require("mongoose");
const cloudinary = require("cloudinary").v2;

// Joi schema để tạo đánh giá
const reviewSchemaJoi = joi.object({
    content: joi.string()
        .required(),
    rating: joi.number()
        .min(1)
        .max(5)
        .required(),
    product: joi.string()
        .required(),
    customer: joi.string()
        .required(),
    image: joi.array()
        .items(joi.string())
        .optional(),
});

// Joi schema để cập nhật đánh giá
const reviewUpdateSchemaJoi = joi.object({
    content: joi.string()
        .optional(),
    rating: joi.number()
        .min(1)
        .max(5)
        .optional(),
    image: joi.array()
        .items(joi.string())
        .optional(),
}).unknown(false);

// Dịch vụ tạo đánh giá mới
const createReviewSvc = async(dataReview) => {
    const { error } = reviewSchemaJoi.validate(dataReview);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        };
    }

    try {
        const newReview = await Review.create(dataReview);
        return newReview;
    } catch (error) {
        if (error.code === 11000) {
            throw {
                statusCode: 409,
                message: "Review already exists"
            };
        }
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};

// Dịch vụ lấy tất cả đánh giá
const getAllReviewsSvc = async() => {
    try {
        const reviews = await Review.find({});
        return reviews;
    } catch (error) {
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};

// Dịch vụ lấy đánh giá theo ID
const getReviewByIdSvc = async(reviewId) => {
    if (!isValidObjectId(reviewId)) {
        throw {
            statusCode: 400,
            message: "Invalid ID format"
        }
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        throw {
            statusCode: 404,
            message: "Review not found"
        }
    }
    return review;

};

// Dịch vụ cập nhật đánh giá
const updateReviewSvc = async(dataReview) => {
    const idReview = dataReview.id;
    delete dataReview.id; // Xóa ID khỏi dataReview

    // Kiểm tra nếu review ID là hợp lệ
    if (!isValidObjectId(idReview)) {
        throw {
            statusCode: 400,
            message: 'Invalid review ID format'
        };
    }

    // Kiểm tra dữ liệu review
    const { error } = reviewUpdateSchemaJoi.validate(dataReview);
    if (error) {
        throw {
            statusCode: 400,
            message: 'Invalid input data: ' + error.details[0].message
        };
    }

    // Tìm review từ DB
    const review = await Review.findById(idReview);
    if (!review) {
        throw {
            statusCode: 404,
            message: 'Review not found'
        };
    }

    try {
        // Cập nhật các trường review
        review.content = dataReview.content || review.content;
        review.rating = dataReview.rating || review.rating;
        review.image = dataReview.image || review.image;

        // Nếu review.image là mảng, xử lý từng ảnh
        if (Array.isArray(review.image)) {
            for (const img of review.image) {
                const publicId = img.split('/').slice(-2).join('/').split('.')[0];
                console.log("OLD IMAGE ID: >> ", publicId);
                await cloudinary.uploader.destroy(publicId); // Xóa ảnh cũ
            }
        } else if (typeof review.image === 'string') {
            const publicId = review.image.split('/').slice(-2).join('/').split('.')[0];
            console.log("OLD IMAGE ID: >> ", publicId);
            await cloudinary.uploader.destroy(publicId); // Xóa ảnh cũ
        }

        // Nếu có ảnh mới, thêm vào
        if (dataReview.image) {
            review.image = dataReview.image;
        }

        const updatedReview = await review.save();
        return {
            statusCode: 200,
            message: 'Review updated successfully',
            data: updatedReview
        };
    } catch (error) {
        throw {
            statusCode: 500,
            message: 'Error updating review: ' + error.message
        };
    }
};



// Dịch vụ xóa đánh giá (xóa mềm)
const deleteReviewSvc = async(reviewId) => {
    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!isValidObjectId(reviewId)) {
        return formatResBodyFailed('Invalid review ID format', 400);
    }

    try {
        // Find the review by its ID
        const review = await Review.findById(reviewId);
        if (!review) {
            return formatResBodyFailed('Review not found', 404);
        }

        // Perform a soft delete
        review.deleted = true; // Assuming `deleted` is a field used for soft delete
        await review.save();

        return formatResBodySuccess(null, 'Review has been successfully deleted');
    } catch (error) {
        return formatResBodyFailed('Error while deleting review: ' + error.message, 500);
    }
};

// Dịch vụ tải ảnh cho đánh giá
const uploadReviewImageSvc = async(file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file.path); // Assuming `file.path` is the path to the file
        return formatResBodySuccess(uploadResponse, 'Image uploaded successfully');
    } catch (error) {
        return formatResBodyFailed('Error uploading image: ' + error.message, 500);
    }
};


// Dịch vụ phục hồi đánh giá đã bị xóa mềm
const restoreReviewSvc = async(reviewId) => {
    if (!isValidObjectId(reviewId)) {
        return formatResBodyFailed('Invalid review ID format', 400);
    }

    try {
        // Find the review by its ID
        const review = await Review.findById(reviewId);
        if (!review) {
            return formatResBodyFailed('Review not found', 404);
        }

        // Perform a soft delete
        review.deleted = true; // Assuming `deleted` is a field used for soft delete
        await review.save();

        return formatResBodySuccess(null, 'Review has been successfully deleted');
    } catch (error) {
        return formatResBodyFailed('Error while deleting review: ' + error.message, 500);
    }
};

module.exports = {
    createReviewSvc,
    getAllReviewsSvc,
    getReviewByIdSvc,
    updateReviewSvc,
    deleteReviewSvc,
    uploadReviewImageSvc,
    restoreReviewSvc,
};