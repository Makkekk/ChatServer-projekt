import express from "express";
import { getChats, saveChats } from "../utils/db.js";
const router = express.Router();

// GET / (Homepage)
router.get("/", (req, res) => {
    if (!req.session.user) return res.render("includes/landingPage");

    // Klient-side JS (load.js) kalder API GET /chats for at hente data
    res.render("includes/listeSide", {
        username: req.session.user.username,
        level: req.session.user.level
    });
});

// NY efter opgavebeskrivelsen

router.get("/chats/:id", async (req, res) => {
    if (!req.session.user) return res.redirect("/loginForm");

    const chatId = req.params.id;

    // Hent chatten for at vise navnet med det samme (valgfrit, men pænt)
    const chats = getChats();
    const chat = chats.find(c => c.id === chatId);

    if (!chat) {
        return res.status(404).render("includes/error", { message: "Chat ikke fundet" });
    }

    res.render("includes/chat", {
        chatId: chatId,
        chatName: chat.name,
        username: req.session.user.username,
        level: req.session.user.level
    });
});



router.get("/createAccount", (req, res) => 
    res.render("includes/createAccount"));

export default router;