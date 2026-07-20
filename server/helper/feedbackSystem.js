const Review = require("../models/review");
const Caregiver = require("../models/caregiver");
const Service = require("../models/service");

async function updateServiceRating(serviceId) {
  const stats = await Review.aggregate([
    {
      $match: {
        serviceId,
        isVisible: true,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  await Service.findByIdAndUpdate(serviceId, {
    rating: stats.length ? Number(stats[0].averageRating.toFixed(1)) : 0,
    totalReviews: stats.length ? stats[0].totalReviews : 0,
  });
}

async function updateCaregiverRating(caregiverId) {
  const stats = await Review.aggregate([
    {
      $match: {
        caregiverId,
        isVisible: true,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  await Caregiver.findByIdAndUpdate(caregiverId, {
    rating: stats.length ? stats[0].averageRating : 0,
    totalReviews: stats.length ? stats[0].totalReviews : 0,
  });
}

async function updateFeedback(serviceId, caregiverId) {
  await Promise.all([
    updateServiceRating(serviceId),
    updateCaregiverRating(caregiverId),
  ]);
}

async function getServiceFeedback(serviceId, pageNumber = 1) {
  const limit = 10;
  const skip = (pageNumber - 1) * limit;

  const totalReviews = await Review.countDocuments({
    serviceId,
    isVisible: true,
  });

  const reviews = await Review.find({
      serviceId,
      isVisible: true,
    })
    .populate({
      path: "patientId",
      populate: {
        path: "userId",
        select: "firstName lastName profileImage",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    reviews,
    totalReviews,
  };
}

module.exports = {
    updateFeedback,
    getServiceFeedback,
};
