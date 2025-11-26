import express from "express";
const router = express.Router();

// GET / (Homepage / Dashboard)
router.get("/", (req, res) => {
    if (!req.session.user) return res.render("includes/landingPage");

    // We render the page EMPTY. 
    // The Client JS (load.js) will call API GET /chats to fill it.
    res.render("includes/listeSide", {
        username: req.session.user.username,
        niveau: req.session.user.niveau
    });
});

// GET /chats/:id (The actual Chat Room)
router.get("/chats/:id", (req, res) => {
    if (!req.session.user) return res.redirect("/loginForm");
    
    // We pass the ID to the pug file so the JS knows which chat to fetch
    res.render("includes/chat", {
        chatId: req.params.id,
        username: req.session.user.username
    });
});

router.get("/loginForm", (req, res) => res.render("includes/loginForm"));

router.get("/createAccount", (req, res) => res.render("includes/createAccount"));

export default router;