import express from "express";
import fs from "fs";
const router = express.Router();

// import JSON-objekter
const chatsJson = fs.readFileSync('./JsonModeller/chats.json');
const chatsListe = JSON.parse(chatsJson);

// get chats
router.get("/chats", (req, res) => {

    res.json(chatsListe);
});

//get /chat/:id
router.get("/chat/:id", (req, res) => {
    const chatId = req.params.id;
    const chats = fs.readFileSync("./JsonModeller/chats.json");
    const chatsData = JSON.parse(chats);
    const chat = chatsData.find(c => c.id === chatId);

    if (!chat) return res.status(404).send("Chat not found");

    res.json(chat);
})

router.get("/chat/messages/:id", (req, res) => {
    const chatId = req.params.id;
    const messages = fs.readFileSync("./JsonModeller/messages.json");
    const messagesData = JSON.parse(messages);  
    const chatMessages = messagesData.filter(m => m.chatId === chatId);
    res.json(chatMessages)
})

router.get("/chat/:id/messages", (req, res) => {
const id = req.params.id;
const chat = chatsListe.find(chat=>{
    return chat.id === id;
}) 
if (!chat){
    res.status(404).send('Chatten blev ikke fundet');
} else {
    res.json(chat.messages)
}
});

// delete /chat/:id
router.delete("/chat/:id", (req, res) => {
    const chat = fs.readFileSync("./JsonModeller/chats.json");
    const chatData = JSON.parse(chat);

    const findChat = chatData.findIndex(c => c.id === req.params.id);
    if (findChat === -1) return res.status(404).send("Chat not found");

    chatsData.splice(findChat, 1);
    fs.writeFileSync("./JsonModeller/chats.json", JSON.stringify(chatsData));

    const messages = fs.readFileSync("./JsonModeller/messages.json");
    const messagesData = JSON.parse(messages);
    const filteredMessages = messagesData.filter(m => m.chatId !== req.params.id);
    fs.writeFileSync("./JsonModeller/messages.json", JSON.stringify(filteredMessages));

    res.sendStatus(204);
})