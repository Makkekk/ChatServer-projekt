import express from "express";
import fs from "fs";

const router = express.Router();

// POST send besked
router.post("/message", (req, res) => {
  const { chatId, messageText } = req.body;

  const messages = JSON.parse(fs.readFileSync("./JsonModeller/messages.json"));

  const newMessage = {
    id: Date.now().toString(),
    chatId,
    sender: req.session.user.username,
    text: messageText,
    date: new Date().toLocaleString()
  };

  messages.push(newMessage);
  fs.writeFileSync("./JsonModeller/messages.json", JSON.stringify(messages));

  res.json(newMessage);
});

export default router;
