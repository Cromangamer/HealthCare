const User = require("../models/user");
const Patient = require("../models/patient");
const Caregiver = require("../models/caregiver");
const verifyFirebaseToken = require("./verifyFirebaseToken");

async function attachCurrentUser(req, res, next) {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (!user || !user.isActive) return res.status(403).json({ message: "Account is unavailable" });
    req.user = user;
    if (user.role === "patient") {
      req.patient = await Patient.findOne({ userId: user._id });
    }
    if (user.role === "caregiver") {
      req.caregiver = await Caregiver.findOne({ userId: user._id });
    }
    next();
  } catch (error) { next(error); }
}

const authenticate = [verifyFirebaseToken, attachCurrentUser];
const requireRole = (...roles) => (req, res, next) => roles.includes(req.user.role)
  ? next()
  : res.status(403).json({ message: "You do not have permission to perform this action" });

module.exports = { authenticate, requireRole };
