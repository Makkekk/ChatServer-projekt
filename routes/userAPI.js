import express from "express";
import fs from "fs";
const router = express.Router();


// GET /users
router.get("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync("./JsonModeller/users.json"));
  res.json(users);
});

// GET /users/:id
router.get("/users/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync("./JsonModeller/users.json"));
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "Bruger ikke fundet" });
  res.json(user);
});

// GET /users/:id/messages
router.get("/users/:id/messages", (req, res) => {
  const messages = JSON.parse(fs.readFileSync("./JsonModeller/messages.json"));
  const userMessages = messages.filter(m => m.sender === req.params.id);
  res.json(userMessages);
});

//opret

export default router;
