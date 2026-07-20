const express = require("express");
const router = express.Router();
const Caregiver = require("../models/caregiver");
const Service = require("../models/service");
const {
  updateFeedback,
  getServiceFeedback,
} = require("../helper/feedbackSystem");

router.post("/", async (req, res) => {
  try {
    const {
      caregiverId,
      serviceType,
      description,
      priceType,
      price,
      duration,
      serviceMode,
      serviceArea,
      availability,
    } = req.body;

    // Check if the caregiver exists
    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }
    // Check if this service already exists for the caregiver
    const existingService = await Service.findOne({ caregiverId, serviceType });
    if (existingService) {
      return res
        .status(400)
        .json({ message: "Service already exists for this caregiver" });
    }

    // Create a new service
    const newService = new Service({
      caregiverId,
      serviceType,
      description,
      priceType,
      price,
      duration,
      serviceMode,
      serviceArea,
      availability,
    });

    // Save the new service
    await newService.save();

    res.status(201).json({
      message: "Service created successfully",
      service: newService,
      serviceExperience: 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }

  // PENDING: Implement the logic to calculate serviceExperience.
  // PENDING: Implement the logic to calculate totalReviews and totalRating.
}); // Create service by caregiver

router.get("/summary", async (req, res) => {
  // GET "/services/summary?city=Rajkot"

  try {
    const { city } = req.query;

    const result = await Service.aggregate([
      {
        $match: {
          "serviceArea.city": city,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$serviceType",
          availableCaregiver: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          serviceType: "$_id",
          availableCaregiver: 1,
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}); // display all types of service in the city

router.get("/:serviceId/reviews", async (req, res) => {
  try {
    const { serviceId } = req.params;

    const pageNumber = Math.max(Number(req.query.page) || 1, 1);
    const limit = 10;

    const { reviews, totalReviews } = await getServiceFeedback(
      serviceId,
      pageNumber,
    );

    const totalPages = Math.ceil(totalReviews / limit);

    const hasNextPage = pageNumber < totalPages;
    const hasPreviousPage = pageNumber > 1;

    return res.status(200).json({
      currentPage: pageNumber,
      totalPages,
      totalReviews,
      hasNextPage,
      hasPreviousPage,
      reviews,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}); // GET /services/123/reviews?page=1

router.get("", async (req, res) => {
  // GET '/services?city=Rajkot&serviceType=Home Nursing'

  try {
    const { serviceType, city, state, pincode } = req.query;

    const filter = {};

    if (!serviceType && !city && !state && !pincode) {
      return res.status(400).json({
        message: "At least one filter is required.",
      });
    }

    if (serviceType) {
      filter.serviceType = serviceType;
    }

    if (city) {
      filter["serviceArea.city"] = city;
    }

    if (state) {
      filter["serviceArea.state"] = state;
    }

    if (pincode) {
      filter["serviceArea.pincode"] = pincode;
    }

    const services = await Service.find(filter).populate({
      path: "caregiverId",
      populate: {
        path: "userId",
        select: "firstName lastName profileImage",
      },
    });

    res.status(200).json(services);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}); // display filtered service with city and types

router.get("/:id", async (req, res) => {
  // GET /service/2934141dfw32ne2ie2

  const serviceID = req.params.id;

  const serviceData = await Service.findById(serviceID).populate({
    path: "caregiverId",
    populate: {
      path: "userId",
      select: "firstName lastName  profileImage",
    },
  });

  if (!serviceData) {
    return res.status(404).json({ message: " No Service Available ! " });
  }

  res.status(200).json(serviceData);
}); // display One service of caregiver in details

module.exports = router;
