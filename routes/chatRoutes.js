import express from "express";
import { getChats, saveChats, getMessages, saveMessages } from "../utils/db.js";


const router = express.Router();

// GET /chat/ -> List of chats (RESTful: Collection resource)
// Previously /chat/listeSide
router.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/loginForm");

  const chats = getChats();
  const userChats = chats.filter(chat => chat.ejer === req.session.user.username);

  res.render("includes/listeSide", {
    username: req.session.user.username,
    niveau: req.session.user.niveau,
    chats: userChats,
    users: []
  });
});

// POST /chat -> Create chat
router.post("/", (req, res) => {
  const chats = getChats();

  const newChat = {
    id: Date.now().toString(),
    name: req.body.chatName,
    ejer: req.session.user.username,
    oprettelsesDato: new Date(),
    messages: []
  };

  chats.push(newChat);
  saveChats(chats);
  res.redirect("/chat"); // Redirect to the list (now at /chat)
});

// GET /chat/:chatId 
router.get("/:chatId", (req, res) => {
  if (!req.session.user) return res.redirect("/loginForm");

  const chats = getChats();
  const chat = chats.find(c => c.id === req.params.chatId);

  if (!chat) return res.redirect("/chat");

  const messages = getMessages();
  // Ensure we match the chatId correctly. Note: messageRoutes.js now uses 'chatId' 
  // but old data might use 'chat' or 'chatId'. 
  // Based on previous file content, it was filtered by 'm.chatId'.
  const chatMessages = messages.filter(m => m.chatId === req.params.chatId);

  res.render("includes/chat", {
    chat,
    chatName: chat.name,
    chatId: chat.id,
    messages: chatMessages,
    username: req.session.user.username,
    niveau: req.session.user.niveau
  });
});

// DELETE /chat/:chatId (REST DELETE)
router.delete("/:chatId", (req, res) => {
  const chats = getChats();
  const chatIndex = chats.findIndex(c => c.id === req.params.chatId);

  if (chatIndex === -1)
    return res.status(404).json({ error: "Chat ikke fundet" });

  chats.splice(chatIndex, 1);
  saveChats(chats);

  const messages = getMessages();
  const updatedMessages = messages.filter(m => m.chatId !== req.params.chatId);
  saveMessages(updatedMessages);

  res.json({ success: true });
});

export default router;