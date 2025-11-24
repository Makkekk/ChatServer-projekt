import express from "express";
import fs from "fs";

const router = express.Router();

// GET /chat/create → page
router.get("/createChat", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const chats = JSON.parse(fs.readFileSync("./JsonModeller/chats.json"));
  const userChats = chats.filter(chat => chat.ejer === req.session.user.username);

  res.render("includes/createChat", {
    username: req.session.user.username,
    niveau: req.session.user.niveau,
    chats: userChats,
    users: []
  });
});

// POST /chat (REST CREATE)
router.post("/", (req, res) => {
  const chats = JSON.parse(fs.readFileSync("./JsonModeller/chats.json"));

  const newChat = {
    id: Date.now().toString(),
    name: req.body.chatName,
    ejer: req.session.user.username,
    oprettelsesDato: new Date(),
    messages: []
  };

  chats.push(newChat);
  fs.writeFileSync("./JsonModeller/chats.json", JSON.stringify(chats));
  res.redirect("/chat/createChat");
});

// GET /chat/:chatId (REST READ)
router.get("/:chatId", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const chats = JSON.parse(fs.readFileSync("./JsonModeller/chats.json"));
  const chat = chats.find(c => c.id === req.params.chatId);

  const messages = JSON.parse(fs.readFileSync("./JsonModeller/messages.json"));
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
  const chats = JSON.parse(fs.readFileSync("./JsonModeller/chats.json"));
  const chatIndex = chats.findIndex(c => c.id === req.params.chatId);

  if (chatIndex === -1)
    return res.status(404).json({ error: "Chat ikke fundet" });

  chats.splice(chatIndex, 1);
  fs.writeFileSync("./JsonModeller/chats.json", JSON.stringify(chats));

  const messages = JSON.parse(fs.readFileSync("./JsonModeller/messages.json"));
  const updatedMessages = messages.filter(m => m.chatId !== req.params.chatId);
  fs.writeFileSync("./JsonModeller/messages.json", JSON.stringify(updatedMessages));

  res.json({ success: true });
});

export default router;
