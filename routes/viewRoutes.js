import express from "express";
import { getChats, saveChats } from "../utils/db.js";
const router = express.Router();

// GET / (Homepage)
router.get("/", (req, res) => {
    if (!req.session.user) return res.render("includes/landingPage");

    
    // The Client JS (load.js) will call API GET /chats to fill it.
    res.render("includes/listeSide", {
        username: req.session.user.username,
        niveau: req.session.user.niveau
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
        chatName: chat.name, // Send navn med direkte
        username: req.session.user.username,
        niveau: req.session.user.niveau
    });
});




// ----------- jamals rediger-chats-navn-knaps funktionalitet -----------------------

/*router.put('/chats/:id', (req, res)=>{
    const user = req.session.user;
    if (!user){
        return res.sendStatus(401);
    }
    const chatId = req.params.id
    const nytNavn = req.body.navn;

    const chats = getChats();
    
    const chatToUpdate = chats.find(chat=> chat.id === chatId)
    if (!chatToUpdate){
        return res.sendStatus(404);
    }
    const isLevel3 = user.niveau === 3;
    const isOwner = user.niveau === 2 && user.username === chatToUpdate.ejer
    
    if (isLevel3 || isOwner){
        chatToUpdate.name = nytNavn
        saveChats(chats);

        res.sendStatus(200);
    } else {
        req.SendStatus(403);
    }
})*/

router.get("/loginForm", (req, res) => 
    res.render("includes/loginForm"));

router.get("/createAccount", (req, res) => 
    res.render("includes/createAccount"));

export default router;