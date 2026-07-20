const express = require("express");
const router = express.Router();
const ChatRoom = require("../models/chatroom");
const Message = require("../models/massage");

const validRoles = ["caregiver", "patient"];

router.post("/:chatRoomId/messages", async (req, res) => {
    try {
        const {chatRoomId} = req.params;
        const {
            message,
            attachments = []
        } = req.body;
        const senderRole = req.user.role;
        const receiverRole = (senderRole === "patient")? "caregiver" : "patient";
        const chatRoom = await chatRoom.findById(chatRoomId);

        if (!chatRoom) {
            return res.status(404).json({
                message: "Chat room not found"
            });
        }
        if (!validRoles.includes(senderRole) || !validRoles.includes(receiverRole)) {
            return res.status(400).json({
                message: "senderRole and receiverRole must be caregiver or patient"
            });
        }

        if (senderRole === receiverRole) {
            return res.status(400).json({
                message: "senderRole and receiverRole must be different"
            });
        }
        const text = message?.trim();

        if (!text && attachments.length === 0) {
            return res.status(400).json({
                message: "message or attachments are required"
            });
        }

        const isPatient = chatRoom.patientId.equals(req.user.patientId);

        const isCaregiver = chatRoom.caregiverId.equals(req.user.caregiverId);
        
        if (!isPatient && !isCaregiver) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }


        const newMessage = new Message({
            chatRoomId: chatRoom._id,
            sender: { role: senderRole },
            receiver: { role: receiverRole },
            message: text || "",
            attachments
        });

        await newMessage.save();

        chatRoom.lastMessageId = newMessage._id;
        
        await chatRoom.save();

        return res.status(201).json({
            success:true,
            message:"Message sent successfully",
            data:newMessage
        });

    } catch (error) {

        console.error("Send message error:", error);

        return res.status(500).json({ message: "Internal server error" });

    }

});

router.get("/:chatRoomId/messages", async (req, res) => {

    try {

        const { chatRoomId } = req.params;

        let chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom) {
            return res.status(404).json({
                message: "Chat room not found."
            });
        }

        const isPatient = chatRoom.patientId.equals(req.user.patientId);

        const isCaregiver = chatRoom.caregiverId.equals(req.user.caregiverId);

        if (!isPatient && !isCaregiver) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        await Message.updateMany(
            {
                chatRoomId,
                "receiver.role": req.user.role,
                isSeen: false
            },
            {
                $set: {
                    isSeen: true,
                    seenAt: new Date()
                }
            }
        );

        const messages = await Message.find({ chatRoomId }).sort({ createdAt: 1 }).limit(30).lean();

        return res.status(200).json({
            message: "Chat Found..." ,
            chatRoomId,
            messages
        });

    } catch (error) {

        console.error("Fetch messages error:", error);

        return res.status(500).json({ message: "Internal server error" });

    }

});

module.exports = router;

