const mongoose = require("mongoose");
const Service = require("../models/service");
const Caregiver = require("../models/caregiver");
const locationValidator = require("../utils/locationValidator");

const editableFields = [
  "serviceType",
  "description",
  "priceType",
  "price",
  "duration",
  "serviceMode",
  "serviceArea",
  "availability",
  "isActive",
];
const validId = (id) => mongoose.Types.ObjectId.isValid(id);
const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const populatedService = (query) =>
  query.populate({
    path: "caregiverId",
    populate: { path: "userId", select: "firstName lastName profileImage" },
  });

exports.create = async (req, res, next) => {
  try {
    const caregiverId =
      req.user.role === "caregiver" ? req.caregiver?._id : req.body.caregiverId;
    if (!caregiverId)
      return res
        .status(400)
        .json({
          message: "A caregiver profile is required before adding services",
        });
    if (req.user.role !== "caregiver" && req.user.role !== "admin")
      return res
        .status(403)
        .json({ message: "Only caregivers can add services" });
    const payload = Object.fromEntries(
      editableFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]]),
    );
    if (
      !payload.serviceType ||
      !payload.description ||
      payload.price === undefined
    )
      return res
        .status(400)
        .json({ message: "serviceType, description and price are required" });
    if (!payload.priceType) payload.priceType = "hourly";
    if (!payload.serviceMode) payload.serviceMode = "in_home";
    if (!payload.serviceArea || !Array.isArray(payload.serviceArea)){
      payload.serviceArea = [];
    } else {
      console.log("Before:", payload.serviceArea);
       payload.serviceArea = payload.serviceArea.map((area) => {
        const location = locationValidator(area.city, area.state);

        return {
          ...area,
          city: location.city,
          state: location.state,
        };
      });
    }
    console.log("After:", payload.serviceArea);
    const duplicate = await Service.findOne({
      caregiverId,
      serviceType: payload.serviceType,
    });
    if (duplicate)
      return res
        .status(409)
        .json({ message: "This caregiver already offers that service" });
    const service = await Service.create({ ...payload, caregiverId });
    res
      .status(201)
      .json({
        message: "Service created successfully",
        service: await populatedService(Service.findById(service._id)),
      });
  } catch (error) {
    next(error);
  }
};

exports.listCaregiver = async (req, res, next) => {
  try {
    if (req.user.role !== "caregiver")
      return res
        .status(403)
        .json({ message: "Only caregivers can view their services" });
    if (!req.caregiver)
      return res.status(404).json({ message: "Caregiver profile not found" });
    const { page = 1, limit = 50 } = req.query;
    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const [services, total] = await Promise.all([
      populatedService(
        Service.find({ caregiverId: req.caregiver._id })
          .sort({ createdAt: -1 })
          .skip((safePage - 1) * safeLimit)
          .limit(safeLimit),
      ),
      Service.countDocuments({ caregiverId: req.caregiver._id }),
    ]);
    res.json({
      services,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createCaregiver = async (req, res, next) => {
  try {
    if (req.user.role !== "caregiver")
      return res
        .status(403)
        .json({ message: "Only caregivers can create services" });
    if (!req.caregiver)
      return res.status(404).json({ message: "Caregiver profile not found" });
    const payload = Object.fromEntries(
      editableFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]]),
    );
    if (
      !payload.serviceType ||
      !payload.description ||
      payload.price === undefined
    )
      return res
        .status(400)
        .json({ message: "serviceType, description and price are required" });
    if (!payload.priceType) payload.priceType = "hourly";
    if (!payload.serviceMode) payload.serviceMode = "in_home";
    if (!payload.serviceArea || !Array.isArray(payload.serviceArea))
      payload.serviceArea = [];
    const duplicate = await Service.findOne({
      caregiverId: req.caregiver._id,
      serviceType: payload.serviceType,
    });
    if (duplicate)
      return res
        .status(409)
        .json({ message: "This caregiver already offers that service" });
    const service = await Service.create({
      ...payload,
      caregiverId: req.caregiver._id,
    });
    res
      .status(201)
      .json({
        message: "Service created successfully",
        service: await populatedService(Service.findById(service._id)),
      });
  } catch (error) {
    next(error);
  }
};

exports.updateCaregiver = async (req, res, next) => {
  try {
    if (req.user.role !== "caregiver")
      return res
        .status(403)
        .json({ message: "Only caregivers can update services" });
    if (!req.caregiver)
      return res.status(404).json({ message: "Caregiver profile not found" });
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (!service.caregiverId.equals(req.caregiver._id))
      return res
        .status(403)
        .json({ message: "You can only edit your own services" });
    const updates = Object.fromEntries(
      editableFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]]),
    );
    Object.assign(service, updates);
    await service.save();
    res.json({
      message: "Service updated successfully",
      service: await populatedService(Service.findById(service._id)),
    });
  } catch (error) {
    next(error);
  }
};

exports.removeCaregiver = async (req, res, next) => {
  try {
    if (req.user.role !== "caregiver")
      return res
        .status(403)
        .json({ message: "Only caregivers can delete services" });
    if (!req.caregiver)
      return res.status(404).json({ message: "Caregiver profile not found" });
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (!service.caregiverId.equals(req.caregiver._id))
      return res
        .status(403)
        .json({ message: "You can only delete your own services" });
    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.createAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ message: "Only admins can create services" });

    const payload = Object.fromEntries(
      editableFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]]),
    );
    const caregiverId = req.body.caregiverId;

    if (!caregiverId)
      return res
        .status(400)
        .json({
          message: "A caregiver profile is required before adding services",
        });
    if (
      !payload.serviceType ||
      !payload.description ||
      payload.price === undefined
    )
      return res
        .status(400)
        .json({ message: "serviceType, description and price are required" });

    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver)
      return res.status(404).json({ message: "Caregiver not found" });

    const duplicate = await Service.findOne({
      caregiverId,
      serviceType: payload.serviceType,
    });
    if (duplicate)
      return res
        .status(409)
        .json({ message: "This caregiver already offers that service" });

    const service = await Service.create({ ...payload, caregiverId });
    res
      .status(201)
      .json({
        message: "Service created successfully",
        service: await populatedService(Service.findById(service._id)),
      });
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const {
      serviceType,
      city,
      state,
      pincode,
      active = "true",
      page = 1,
      limit = 12,
    } = req.query;
    const filter = {};
    if (serviceType) filter.serviceType = serviceType;
    if (city)
      filter["serviceArea.city"] = new RegExp(`^${escapeRegex(city)}$`, "i");
    if (state)
      filter["serviceArea.state"] = new RegExp(`^${escapeRegex(state)}$`, "i");
    if (pincode) filter["serviceArea.pincode"] = Number(pincode);
    if (active !== "all") filter.isActive = active === "true";
    const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);
    const safePage = Math.max(Number(page) || 1, 1);
    const [services, total] = await Promise.all([
      populatedService(
        Service.find(filter)
          .sort({ createdAt: -1 })
          .skip((safePage - 1) * safeLimit)
          .limit(safeLimit),
      ),
      Service.countDocuments(filter),
    ]);
    res.json({
      services,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.listAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Only admins can view services" });
    const { page = 1, limit = 50 } = req.query;
    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const [services, total] = await Promise.all([
      populatedService(
        Service.find({})
          .sort({ createdAt: -1 })
          .skip((safePage - 1) * safeLimit)
          .limit(safeLimit),
      ),
      Service.countDocuments({}),
    ]);
    res.json({
      services,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    if (!validId(req.params.id))
      return res.status(400).json({ message: "Invalid service id" });
    const service = await populatedService(Service.findById(req.params.id));
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    next(error);
  }
};
exports.update = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (
      req.user.role !== "admin" &&
      (!req.caregiver || !service.caregiverId.equals(req.caregiver._id))
    )
      return res
        .status(403)
        .json({ message: "You can only edit your own services" });
    const updates = Object.fromEntries(
      editableFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]]),
    );
    Object.assign(service, updates);
    await service.save();
    res.json({
      message: "Service updated successfully",
      service: await populatedService(Service.findById(service._id)),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ message: "Only admins can update services" });
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const updates = Object.fromEntries(
      editableFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]]),
    );
    if (req.body.caregiverId) {
      const caregiver = await Caregiver.findById(req.body.caregiverId);
      if (!caregiver)
        return res.status(404).json({ message: "Caregiver not found" });
      service.caregiverId = req.body.caregiverId;
    }

    Object.assign(service, updates);
    await service.save();
    res.json({
      message: "Service updated successfully",
      service: await populatedService(Service.findById(service._id)),
    });
  } catch (error) {
    next(error);
  }
};
exports.remove = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (
      req.user.role !== "admin" &&
      (!req.caregiver || !service.caregiverId.equals(req.caregiver._id))
    )
      return res
        .status(403)
        .json({ message: "You can only delete your own services" });
    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.removeAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ message: "Only admins can delete services" });
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};
exports.summary = async (req, res, next) => {
  try {
    const match = { isActive: true };
    const location = locationValidator(req.query.city, req.query.state);
    if (location.city)
      match["serviceArea.city"] = new RegExp(
        `^${escapeRegex(location.city)}$`,
        "i",
      );
    if (location.state)
      match["serviceArea.state"] = new RegExp(
        `^${escapeRegex(location.state)}$`,
        "i",
      );
      const matched = await Service.find(match);
      console.log(
        matched.map((s) => ({
          caregiver: s.caregiverId,
          serviceType: s.serviceType,
          city: s.serviceArea[0]?.city,
          state: s.serviceArea[0]?.state,
          isActive: s.isActive,
        }))
      );
    const result = await Service.aggregate([
      { $match: match },
      { $group: { _id: "$serviceType", availableCaregiver: { $sum: 1 } } },
      { $project: { _id: 0, serviceType: "$_id", availableCaregiver: 1 } },
    ]);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
