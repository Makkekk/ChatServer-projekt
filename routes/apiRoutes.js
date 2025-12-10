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
    if (!chat) 
        return res.status(404).json({ error: "Not found" });
    res.json(chat);
});

router.post("/chats", (req, res) => {
    const name = req.body.name;
    const owner = req.session.user.username;
    const chats = getChats();
    const newChat = {
        id: Date.now().toString(),
        name: name,
        owner: owner,
        date: new Date().toLocaleString('da-DK'),
        messages: []
    };
    chats.push(newChat);
    saveChats(chats);
    res.status(201).json(newChat);
});

// GET /chats/:id/messages (Beskeder i en chat)
router.get("/chats/:id/messages", (req, res) => {
    const chats = getChats();
    const chat = chats.find(c => c.id === req.params.id);

    //retuner arrayet inde i chats
    res.json(chat.messages);
});

// DELETE /chats/:id (slet chat for brugere med level 2 og 3)
router.delete("/chats/:id", (req, res) => {
    const chats = getChats();
    const index = chats.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    const chat = chats[index];
    const user = req.session.user;

    // Level 3: kan slette alle chats
    // Level 2: kan slette egne chats
    // Level 1: kan ikke slette chats
    const isOwner = chat.owner === user.username;

    if (user.level === 3 || (user.level === 2 && isOwner)) {
        chats.splice(index, 1);
        saveChats(chats);

        res.json({ success: true });
    } else {
        res.status(403).json({ error: "Permission denied" });
    }
});

// PUT /chats/:id – opdater chat-navn (kun owner eller admin)
router.put("/chats/:id", (req, res) => {
    const chatId = req.params.id;
    const { name: newName } = req.body;

    if (!newName || newName.trim() === "") {
        return res.status(400).json({ error: "Chatnavn må ikke være tomt" });
    }

    const chats = getChats();
    const chatIndex = chats.findIndex(c => c.id === chatId);

    if (chatIndex === -1) {
        return res.status(404).json({ error: "Chat ikke fundet" });
    }

    const chat = chats[chatIndex];
    const user = req.session.user;

    const isOwner = chat.owner === user.username;
    const isAdmin = user.level === 3;

    if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: "Ingen tilladelse" });
    }

    chat.name = newName.trim();
    saveChats(chats);

    res.json({ success: true, chat });
});

router.get("/chats/messages/:id", (req, res) => {
    // Hent chats, eller send et tomt array hvis ingen findes
    const chats = getChats() || [];
    const messageId = req.params.id;

    // Søg efter beskeden i alle chats
    for (const chat of chats) {
        // Spring over hvis chatten ikke har beskeder
        if (!chat.messages) continue;

        const msg = chat.messages.find(m => m.id === messageId);

        if (msg) return res.json(msg);
    }

    // Hvis ingen besked fundet
    res.status(404).json({ error: "Message not found" });
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
        date: new Date().toLocaleString('da-DK')
    };

    
    if (!chat.messages) {
      chat.messages = []; 
    } 
    
    chat.messages.push(newMessage);
    saveChats(chats);

    res.json(newMessage);
});


// GET /users (List users)
router.get("/users", (req, res) => {
    if (req.session.user.level !== 3) return res.status(403).json({ error: "Admin only" });

    const users = getUsers();

    const mapUser = users.map(u => ({ id: u.id, username: u.username, level: u.level }));
    res.json(mapUser);
});

router.get("/users/:id", (req, res) => {
    if (req.session.user.level !== 3)
        return res.status(403).json({ error: "Admin only" });

    const users = getUsers();
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
        res.status(404).json({ error: "User not found" });
    } else {
        const userToSend = { id: user.id, username: user.username, level: user.level };
        res.json(userToSend);
    }
});

router.get("/users/:id/messages", (req, res) => {
    if (req.session.user.level !== 3)
        return res.status(403).json({ error: "Admin only" });

    const users = getUsers();
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const chats = getChats();
    const userMessages = [];

    chats.forEach(chat => {
        // Spring over hvis chatten ikke har beskeder
        if (!chat.messages) return;

        chat.messages.forEach(message => {
            if (message.sender === user.username) {
                userMessages.push(message);
            }
        });
    });

    if (userMessages.length > 0) {
        res.json(userMessages);
    } else {
        res.status(404).json({ error: "No messages" });
    }
});

router.put("/users/:id", (req, res) => {
    if (!req.session.user || req.session.user.level !== 3) {
        return res.status(403).json({ error: "Admin only" });
    }
    const userId = req.params.id;
    const newLevel = req.body.level;

    if (![1, 2, 3].includes(newLevel)) {
        return res.status(400).json({ error: "Invalid level" });
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    // Forhindrer admin i at ændre sit eget level
    if (users[userIndex].id === req.session.user.id) {
        return res.status(400).json({ error: "Cannot change own level" });
    }
    users[userIndex].level = newLevel;
    saveUsers(users);

    res.json({ success: true, user: { id: userId, level: newLevel } });
});




// DELETE /users/:id (slet bruger - kun admin)
router.delete("/users/:id", (req, res) => {
    if (req.session.user.level !== 3) return res.status(403).json({ error: "Admin only" });

    const users = getUsers();
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "User not found" });

    // Forhindrer admin i at slette sig selv
    if (users[index].id === req.session.user.id) return res.status(400).json({ error: "Cannot delete self" });

    users.splice(index, 1);
    saveUsers(users);
    res.json({ success: true });
});

export default router;