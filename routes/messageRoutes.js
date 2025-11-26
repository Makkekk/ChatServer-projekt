import express from "express";
import { getMessages, saveMessages } from "../utils/db.js";

const router = express.Router();

// POST send besked
router.post("/chats/message", (req, res) => {
  const chatId = req.body.chatId;
  const messageText = req.body.messageText;

  // Load existing messages
  const messages = getMessages();

  const newMessage = {
    id: Date.now().toString(),
    chatId: chatId, // Changed 'chat' to 'chatId' to be consistent with how you filter it elsewhere (e.g. in chatRoutes)
    sender: req.session.user.username,
    text: messageText,
    date: new Date().toLocaleString()
  };

  messages.push(newMessage);
  saveMessages(messages);

  res.json(newMessage);
});

export default router;
