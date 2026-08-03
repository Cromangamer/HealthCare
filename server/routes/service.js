const express = require("express");
const Service = require("../models/service");
const { authenticate } = require("../middleware/authenticate");
const service = require("../controllers/serviceController");
const { getServiceFeedback } = require("../helper/feedbackSystem");
const router = express.Router();

router.get("/summary", service.summary);
router.get("/", service.list);
router.post("/", authenticate, service.create);
router.get("/:id/reviews", async (req, res, next) => { try { const page = Math.max(Number(req.query.page) || 1, 1); const { reviews, totalReviews } = await getServiceFeedback(req.params.id, page); res.json({ currentPage: page, totalPages: Math.ceil(totalReviews / 10), totalReviews, hasNextPage: page * 10 < totalReviews, hasPreviousPage: page > 1, reviews }); } catch (error) { next(error); } });
router.get("/:id", service.getOne);
router.patch("/:id", authenticate, service.update);
router.delete("/:id", authenticate, service.remove);

router.get("/admin/services", authenticate, service.listAdmin);
router.post("/admin/services", authenticate, service.createAdmin);
router.patch("/admin/services/:id", authenticate, service.updateAdmin);
router.delete("/admin/services/:id", authenticate, service.removeAdmin);

router.get("/caregiver/services", authenticate, service.listCaregiver);
router.post("/caregiver/services", authenticate, service.createCaregiver);
router.put("/caregiver/services/:id", authenticate, service.updateCaregiver);
router.delete("/caregiver/services/:id", authenticate, service.removeCaregiver);
module.exports = router;
