import express from "express";
import { getChats, saveChats, getUsers, saveUsers } from "../utils/db.js";

const router = express.Router();

// Middleware for at sikre om bruger er logget ind
const checkAuth = (req, res, next) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });
    next();
};

router.use(checkAuth);


// GET /chats (Lise af alle chats)
router.get("/chats", (req, res) => {
    const chats = getChats();
  
    res.json(chats);
});

// GET /chats/:id (Specifik chat)
router.get("/chats/:id", (req, res) => {
    const chats = getChats();
    const chat = chats.find(c => c.id === req.params.id);
    if (!chat) return res.status(404).json({ error: "Not found" });
    res.json(chat);
});

// GET /chats/:id/messages (Beskeder i en chat)
router.get("/chats/:id/messages", (req, res) => {
    const chats = getChats();
    const chat = chats.find(c => c.id === req.params.id);

    //retuner arrayet inde i chats
    res.json(chat.messages);
});

// POST /chats (Opret chat)
router.post("/chats", (req, res) => {
    const chats = getChats();
    const newChat = {
        id: Date.now().toString(),
        name: req.body.name, 
        ejer: req.session.user.username,
        oprettelsesDato: new Date(),
    };
    chats.push(newChat);
    saveChats(chats);
    res.json(newChat);
});

// DELETE /chats/:id (slet chat for brugere med niveau 2 og 3)) 
router.delete("/chats/:id", (req, res) => {
    const chats = getChats();
    const index = chats.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    const chat = chats[index];
    const user = req.session.user;

    // Level 3: kan slette alle chats
    // Level 2: kan slette egne chats
    // Level 1: kan ikke slette chats
    const isOwner = chat.ejer === user.username;
    
    if (user.niveau === 3 || (user.niveau === 2 && isOwner)) {
        chats.splice(index, 1);
        saveChats(chats);
        
        // Clean up messages
        const allMessages = getChats().flatMap(c => c.messages);
        const remainingMessages = allMessages.filter(m => m.chatId !== req.params.id);
        saveMessages(remainingMessages);
        
        res.json({ success: true });
    } else {
        res.status(403).json({ error: "Permission denied" });
    }
});

// POST /chats/message (Send besekd)
router.post("/chats/message", (req, res) => {
    const chatid = req.body.chatId;
    const text = req.body.text;
   
    const chats = getChats();
    
   
    const chat = chats.find(c => c.id === chatid);
    if (!chat) return res.status(404).json({ error: "Chat not found" });


    const newMessage = {
        id: Date.now().toString(),
        chatId: chatid, 
        sender: req.session.user.username,
        text: text,
        date: new Date().toLocaleString()
    };

    
    if (!chat.messages) {
      chat.messages = []; 
    } else {
    chat.messages.push(newMessage);
    }
    saveChats(chats);

    res.json(newMessage);
});


// GET /users (List users)
router.get("/users", (req, res) => {
    
    if (req.session.user.niveau !== 3) return res.status(403).json({ error: "Admin only" });
    
    const users = getUsers();
    
    const safeUsers = users.map(u => ({ id: u.id, username: u.username, niveau: u.niveau }));
    res.json(safeUsers);
});

// DELETE /users/:id (Admin delete user)
router.delete("/users/:id", (req, res) => {
    if (req.session.user.niveau !== 3) return res.status(403).json({ error: "Admin only" });
    
    const users = getUsers();
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "User not found" });

    // Prevent deleting self
    if (users[index].id === req.session.user.id) return res.status(400).json({ error: "Cannot delete self" });

    users.splice(index, 1);
    saveUsers(users);
    res.json({ success: true });
});



export default router;