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

// GET /chats/:id (hvis den chat der er bundet op mod ID'et)
router.get("/chat/:id", (req, res) => {
    if (!req.session.user) return res.redirect("/loginForm");
    
    res.render("includes/chat", {
        chatId: req.params.id,
        username: req.session.user.username
    });
});



// ----------- jamals rediger-chats-navn-knaps funktionalitet -----------------------

router.put('/chats/:id', (req, res)=>{
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
})

router.get("/loginForm", (req, res) => 
    res.render("includes/loginForm"));

router.get("/createAccount", (req, res) => 
    res.render("includes/createAccount"));

export default router;