import express from "express";
import { getChats, saveChats, getMessages, saveMessages, getUsers, saveUsers } from "../utils/db.js";

const router = express.Router();

// Middleware to ensure user is logged in before accessing API
const checkAuth = (req, res, next) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });
    next();
};

router.use(checkAuth);

// --- CHATS [cite: 22-29] ---

// GET /chats (List all chats)
router.get("/chats", (req, res) => {
    const chats = getChats();
    // Level 1+: Can see chats. 
    // PDF implies filtering based on ownership happens in logic or view, 
    // but usually, Level 1 sees all or specific ones. Let's return all for the list.
    res.json(chats);
});

// GET /chats/:id (Specific chat)
router.get("/chats/:id", (req, res) => {
    const chats = getChats();
    const chat = chats.find(c => c.id === req.params.id);
    if (!chat) return res.status(404).json({ error: "Not found" });
    res.json(chat);
});

// GET /chats/:id/messages (Messages in a chat)
router.get("/chats/:id/messages", (req, res) => {
    const messages = getMessages();
    const chatMessages = messages.filter(m => m.chatId === req.params.id);
    res.json(chatMessages);
});

// POST /chats (Create Chat - Implicit requirement for "oprettelse af chats")
router.post("/chats", (req, res) => {
    const chats = getChats();
    const newChat = {
        id: Date.now().toString(),
        name: req.body.name, // Client sends { name: "..." }
        ejer: req.session.user.username,
        oprettelsesDato: new Date(),
    };
    chats.push(newChat);
    saveChats(chats);
    res.json(newChat);
});

// DELETE /chats/:id (Delete Chat - Logic for Levels 2 & 3) [cite: 6, 7]
router.delete("/chats/:id", (req, res) => {
    const chats = getChats();
    const index = chats.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    const chat = chats[index];
    const user = req.session.user;

    // Level 3: Can delete ANY chat
    // Level 2: Can delete OWN chat
    // Level 1: Cannot delete
    const isOwner = chat.ejer === user.username;
    
    if (user.niveau === 3 || (user.niveau === 2 && isOwner)) {
        chats.splice(index, 1);
        saveChats(chats);
        
        // Clean up messages
        const allMessages = getMessages();
        const remainingMessages = allMessages.filter(m => m.chatId !== req.params.id);
        saveMessages(remainingMessages);
        
        res.json({ success: true });
    } else {
        res.status(403).json({ error: "Permission denied" });
    }
});

// POST /chats/message (Send message)
router.post("/chats/message", (req, res) => {
    const { chatId, text } = req.body;
    const messages = getMessages();
    const newMessage = {
        id: Date.now().toString(),
        chatId: chatId,
        sender: req.session.user.username,
        text: text,
        date: new Date().toLocaleString()
    };
    messages.push(newMessage);
    saveMessages(messages);
    res.json(newMessage);
});


// GET /users (List users)
router.get("/users", (req, res) => {
    // Only Level 3 should see user list? 
    if (req.session.user.niveau !== 3) return res.status(403).json({ error: "Admin only" });
    
    const users = getUsers();
    // Don't send passwords!
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