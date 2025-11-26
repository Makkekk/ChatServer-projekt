import express from "express";
import { getChats, getMessages, getUsers } from "../utils/db.js";

const router = express.Router();

// GET /api/chats - Returns chats filtered by user permission
router.get("/", (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });

  const chats = getChats();
  let visibleChats = [];

  if (req.session.user.niveau === 3) {
      // Admin: Ser alle chats
      visibleChats = chats;
  } else {
      // Andre: Ser kun egne chats
      visibleChats = chats.filter(chat => chat.ejer === req.session.user.username);
  }
  
  res.json(visibleChats);
});

// GET /api/chats/:id - Returns a specific chat as JSON
router.get("/:id", (req, res) => {
  const chatId = req.params.id;
  const chats = getChats();
  const chat = chats.find(c => c.id === chatId);

  if (!chat) return res.status(404).json({ error: "Chat not found" });

  res.json(chat);
});

// GET /api/chats/:id/messages - Returns messages for a specific chat as JSON
router.get("/:id/messages", (req, res) => {
  const chatId = req.params.id;
  const messages = getMessages();
  const chatMessages = messages.filter(m => m.chatId === chatId); // Assuming messages have a chatId
  res.json(chatMessages);
});

export default router;
