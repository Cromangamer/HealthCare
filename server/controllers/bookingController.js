const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Service = require("../models/service");
const Patient = require("../models/patient");
const Caregiver = require("../models/caregiver");
const ChatRoom = require("../models/chatroom");

const validId = (id) => mongoose.Types.ObjectId.isValid(id);
const populateBooking = (query) => query.populate({ path: "patientId", populate: { path: "userId", select: "firstName lastName email phone profileImage" } }).populate({ path: "caregiverId", populate: { path: "userId", select: "firstName lastName email phone profileImage" } }).populate("serviceId", "serviceType description price priceType duration serviceMode serviceArea");
function mayAccess(booking, req) { return req.user.role === "admin" || (req.patient && booking.patientId.equals(req.patient._id)) || (req.caregiver && booking.caregiverId.equals(req.caregiver._id)); }
const normalizeStatuses = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) return value;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
};
const getRoleTransitionMap = (bookingStatus, role) => {
  const transitions = {
    pending: {
      patient: ["cancelled"],
      caregiver: ["accepted", "rejected"],
      admin: ["accepted", "rejected", "cancelled"],
    },
    accepted: {
      patient: ["cancelled"],
      caregiver: ["started", "cancelled"],
      admin: ["started", "cancelled"],
    },
    started: {
      caregiver: ["completed", "cancelled"],
      admin: ["completed", "cancelled"],
    },
  };

  return transitions[bookingStatus]?.[role] || [];
};

exports.create = async (req, res, next) => {
  try {
    if (!req.patient) return res.status(403).json({ message: "Only patients can create bookings" });
    const { serviceId, notes, paymentMethod = "cash" } = req.body;
    if (!validId(serviceId)) return res.status(400).json({ message: "A valid serviceId is required" });
    const service = await Service.findOne({ _id: serviceId, isActive: true });
    if (!service) return res.status(404).json({ message: "Active service not found" });
    const existing = await Booking.findOne({ patientId: req.patient._id, serviceId, status: { $in: ["pending", "accepted", "started"] } });
    if (existing) return res.status(409).json({ message: "An active booking for this service already exists" });
    const booking = await Booking.create({ patientId: req.patient._id, caregiverId: service.caregiverId, serviceId, notes, paymentMethod });
    res.status(201).json({ message: "Booking created successfully", booking: await populateBooking(Booking.findById(booking._id)) });
  } catch (error) { next(error); }
};
exports.list = async (req, res, next) => { try { const { status, page = 1, limit = 12 } = req.query; const filter = {}; const normalizedStatuses = normalizeStatuses(status); if (normalizedStatuses?.length) { filter.status = { $in: normalizedStatuses }; } else { filter.status = { $in: ["pending", "accepted", "started", "rejected"] }; } if (req.user.role === "patient") { if (!req.patient) return res.json({ bookings: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 0 } }); filter.patientId = req.patient._id; } else if (req.user.role === "caregiver") { if (!req.caregiver) return res.json({ bookings: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 0 } }); filter.caregiverId = req.caregiver._id; } const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 50); const safePage = Math.max(Number(page) || 1, 1); const [bookings, total] = await Promise.all([populateBooking(Booking.find(filter).sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit)), Booking.countDocuments(filter)]); res.json({ bookings, pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } }); } catch (error) { next(error); } };
exports.getOne = async (req, res, next) => { try { const booking = await populateBooking(Booking.findById(req.params.id)); if (!booking) return res.status(404).json({ message: "Booking not found" }); if (!mayAccess(booking, req)) return res.status(403).json({ message: "Unauthorized" }); const chatRoom = await ChatRoom.findOne({ bookingId: booking._id }); res.json({ booking, chatRoom }); } catch (error) { next(error); } };
exports.update = async (req, res, next) => { try { const booking = await Booking.findById(req.params.id); if (!booking) return res.status(404).json({ message: "Booking not found" }); if (!mayAccess(booking, req)) return res.status(403).json({ message: "Unauthorized" }); if (!["pending", "accepted"].includes(booking.status)) return res.status(409).json({ message: "Only pending or accepted bookings can be edited" }); if (req.body.notes !== undefined) booking.notes = req.body.notes; if (req.body.paymentMethod !== undefined) booking.paymentMethod = req.body.paymentMethod; await booking.save(); res.json({ message: "Booking updated successfully", booking: await populateBooking(Booking.findById(booking._id)) }); } catch (error) { next(error); } };
exports.remove = async (req, res, next) => { try { const booking = await Booking.findById(req.params.id); if (!booking) return res.status(404).json({ message: "Booking not found" }); if (!mayAccess(booking, req)) return res.status(403).json({ message: "Unauthorized" }); if (req.user.role !== "admin" && !["pending", "rejected", "cancelled"].includes(booking.status)) return res.status(409).json({ message: "Only inactive bookings can be deleted" }); await ChatRoom.deleteOne({ bookingId: booking._id }); await booking.deleteOne(); res.json({ message: "Booking deleted successfully" }); } catch (error) { next(error); } };
exports.changeStatus = async (req, res, next) => { try { const { status } = req.body; const booking = await Booking.findById(req.params.id); if (!booking) return res.status(404).json({ message: "Booking not found" }); const isCaregiver = req.caregiver && booking.caregiverId.equals(req.caregiver._id); const isPatient = req.patient && booking.patientId.equals(req.patient._id); if (req.user.role !== "admin" && !isCaregiver && !isPatient) return res.status(403).json({ message: "Unauthorized" }); const role = req.user.role === "admin" ? "admin" : isCaregiver ? "caregiver" : isPatient ? "patient" : null; if (!role) return res.status(403).json({ message: "Unauthorized" }); const allowedTransitions = getRoleTransitionMap(booking.status, role); if (!allowedTransitions.includes(status)) return res.status(400).json({ message: "Invalid status transition" }); booking.status = status; await booking.save(); let chatRoom = null; if (status === "accepted") chatRoom = await ChatRoom.findOneAndUpdate({ bookingId: booking._id }, { patientId: booking.patientId, caregiverId: booking.caregiverId }, { new: true, upsert: true, setDefaultsOnInsert: true }); res.json({ message: `Booking ${status} successfully`, booking, chatRoom }); } catch (error) { next(error); } };
exports.history = async (req, res, next) => { req.query.status = "completed,cancelled"; return exports.list(req, res, next); };
exports.getRoleTransitionMap = getRoleTransitionMap;
