import express from "express";
import { getUsers, getMessages } from "../utils/db.js";
const router = express.Router();

//Handles admin deleting users of listing users

// GET /users
router.get("/users", (req, res) => {
  const users = getUsers();
  res.json(users);
});

// GET /users/:id
router.get("/users/:id", (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "Bruger ikke fundet" });
  res.json(user);
});

// GET /users/:id/messages
router.get("/users/:id/messages", (req, res) => {
  const messages = getMessages();
  const userMessages = messages.filter(m => m.sender === req.params.id); // Assuming sender is user ID
  res.json(userMessages);
});

export default router;
