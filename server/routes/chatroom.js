const express = require("express");
const { authenticate } = require("../middleware/authenticate");
const chat = require("../controllers/chatController");
const router = express.Router();

router.use(authenticate);
router.get("/", chat.listRooms);
router.get("/:chatRoomId", chat.getRoom);
router.get("/:chatRoomId/messages", chat.listMessages);
router.post("/:chatRoomId/messages", chat.sendMessage);
module.exports = router;
