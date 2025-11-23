import express from "express";
import { createChatPage, createChat, getChat, deleteChat } from "../controllers/chatController.js";

const router = express.Router();

router.get("/createChat", createChatPage);
router.post("/create/chat", createChat);

router.get("/:chatId", getChat);
router.delete("/:chatId", deleteChat);

export default router;
