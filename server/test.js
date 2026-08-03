const assert = require("assert");
const admin = require("./config/firebaseAdmin");
const User = require("./models/user");
const serviceController = require("./controllers/serviceController");
const chatController = require("./controllers/chatController");
const bookingController = require("./controllers/bookingController");

assert.strictEqual(admin.apps.length > 0, true, "Firebase Admin should initialize");
assert.ok(User.schema.path("role").enumValues.includes("patient"), "User role enum should include patient");
assert.ok(typeof serviceController.createAdmin === "function", "Service controller should expose createAdmin");
assert.ok(typeof serviceController.listAdmin === "function", "Service controller should expose listAdmin");
assert.ok(typeof serviceController.updateAdmin === "function", "Service controller should expose updateAdmin");
assert.ok(typeof serviceController.removeAdmin === "function", "Service controller should expose removeAdmin");
assert.ok(typeof serviceController.listCaregiver === "function", "Service controller should expose listCaregiver");
assert.ok(typeof serviceController.createCaregiver === "function", "Service controller should expose createCaregiver");
assert.ok(typeof serviceController.updateCaregiver === "function", "Service controller should expose updateCaregiver");
assert.ok(typeof serviceController.removeCaregiver === "function", "Service controller should expose removeCaregiver");
assert.ok(typeof chatController.listRooms === "function", "Chat controller should expose listRooms");
assert.ok(typeof chatController.getRoom === "function", "Chat controller should expose getRoom");
assert.ok(typeof chatController.sendMessage === "function", "Chat controller should expose sendMessage");
assert.ok(typeof chatController.listMessages === "function", "Chat controller should expose listMessages");
assert.ok(typeof bookingController.changeStatus === "function", "Booking controller should expose changeStatus");

const transitionMap = {
  pending: { patient: ["cancelled"], caregiver: ["accepted", "rejected"], admin: ["accepted", "rejected", "cancelled"] },
  accepted: { patient: ["cancelled"], caregiver: ["started", "cancelled"], admin: ["started", "cancelled"] },
  started: { caregiver: ["completed", "cancelled"], admin: ["completed", "cancelled"] },
};

assert.deepStrictEqual(bookingController.getRoleTransitionMap("pending", "patient"), ["cancelled"], "Patient pending transitions should include cancelled only");
assert.deepStrictEqual(bookingController.getRoleTransitionMap("accepted", "caregiver"), ["started", "cancelled"], "Caregiver accepted transitions should include started and cancelled");
assert.deepStrictEqual(bookingController.getRoleTransitionMap("started", "caregiver"), ["completed", "cancelled"], "Caregiver started transitions should include completed and cancelled");
assert.deepStrictEqual(bookingController.getRoleTransitionMap("pending", "caregiver"), ["accepted", "rejected"], "Caregiver pending transitions should include accept and reject");
assert.deepStrictEqual(bookingController.getRoleTransitionMap("accepted", "patient"), ["cancelled"], "Patient accepted transitions should include cancelled");

console.log("Firebase Admin initialized:", admin.apps.length > 0);