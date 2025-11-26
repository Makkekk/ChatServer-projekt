import express from "express";
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

router.get("/loginForm", (req, res) => 
    res.render("includes/loginForm"));

router.get("/createAccount", (req, res) => 
    res.render("includes/createAccount"));

export default router;