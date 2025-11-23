import express from "express";
import session from "express-session";
import fs from "fs";

const app = express();

app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "hemligkode",
    resave: false,
    saveUninitialized: true
  })
);

app.use("/assets", express.static("./public/assets"));

// ------------------- AUTH -------------------
// Landingpage
app.get("/", (req, res) => {
  if (!req.session.user) {
    return res.render("includes/landingPage");
  }
  // Vis kun chats som tilhører brugeren
  const chats = JSON.parse(fs.readFileSync("./JsonModeller/chats.json"));
  const userChats = chats.filter(chat => chat.ejer === req.session.user.username);

  res.render("includes/index", {
    username: req.session.user.username,
    niveau: req.session.user.niveau,
    chats: userChats,
    users: [] // Admin kan tilføjes senere
  });
});

// Login page
app.get("/login", (req, res) => res.render("includes/login"));


// Create account page
app.get("/createAccount", (req, res) => res.render("includes/createAccount"));
// Login POST
app.post("/login", (req, res) => {
  const { brugernavn, adgangskode } = req.body;
  const users = JSON.parse(fs.readFileSync("./JsonModeller/users.json"));
  const user = users.find(u => u.username === brugernavn && u.password === adgangskode);

  if (!user) return res.send("Forkert login");

  req.session.user = user;
  res.redirect("/");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// Create account POST
app.post("/opret-bruger", (req, res) => {
  const { brugernavn, adgangskode } = req.body;
  const users = JSON.parse(fs.readFileSync("./JsonModeller/users.json"));

  if (users.find(u => u.username === brugernavn)) return res.send("Brugernavn allerede taget");

  const newUser = {
    id: Date.now().toString(),
    username: brugernavn,
    password: adgangskode,
    niveau: 1,
    dato: new Date()
  };

  users.push(newUser);
  fs.writeFileSync("./JsonModeller/users.json", JSON.stringify(users));
  res.redirect("/login");
});

// ------------------- CHATS -------------------

// Create chat page
app.get("/createChat", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const chats = JSON.parse(fs.readFileSync("./JsonModeller/chats.json"));

const userChats = chats.filter(chat => chat.ejer === req.session.user.username);

  res.render("includes/createChat", {
    username: req.session.user.username,
    niveau: req.session.user.niveau,
    chats: userChats,
    users: []
  });
});

// Create chat POST
app.post("/create/chat", (req, res) => {
  const chats = JSON.parse(fs.readFileSync("./JsonModeller/chats.json"));
  const newChat = {
    id: Date.now().toString(),
    name: req.body.chatName,
    ejer: req.session.user.username,
    oprettelsesDato: new Date(),
    messages: []
  };
  chats.push(newChat);
  fs.writeFileSync("./JsonModeller/chats.json", JSON.stringify(chats));
  res.redirect("/createChat");
});

// Get single chat
app.get("/chat/:chatId", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const chats = JSON.parse(fs.readFileSync("./JsonModeller/chats.json"));
  const chat = chats.find(c => c.id === req.params.chatId);

  const messages = JSON.parse(fs.readFileSync("./JsonModeller/messages.json"));
  const chatMessages = messages.filter(m => m.chatId === req.params.chatId);

  res.render("includes/chat", {
    chat,
    chatName: chat.name,
    chatId: chat.id,
    messages: chatMessages,
    username: req.session.user.username,
    niveau: req.session.user.niveau
  });
});

// Delete chat
app.delete("/chat/:chatId", (req, res) => {
  const chats = JSON.parse(fs.readFileSync("./JsonModeller/chats.json"));
  const chatIndex = chats.findIndex(c => c.id === req.params.chatId);

  if (chatIndex === -1) return res.status(404).json({ error: "Chat ikke fundet" });

  chats.splice(chatIndex, 1);
  fs.writeFileSync("./JsonModeller/chats.json", JSON.stringify(chats));

  const messages = JSON.parse(fs.readFileSync("./JsonModeller/messages.json"));
  const newMessages = messages.filter(m => m.chatId !== req.params.chatId);
  fs.writeFileSync("./JsonModeller/messages.json", JSON.stringify(newMessages));
  res.json({ success: true });
});

// ------------------- MESSAGES -------------------

app.post("/chat/message", (req, res) => {
  const { chatId, messageText } = req.body;

  const messages = JSON.parse(fs.readFileSync("./JsonModeller/messages.json"));

  const newMessage = {
    id: Date.now().toString(),
    chatId,
    sender: req.session.user.username,
    text: messageText,
    date: new Date().toLocaleString()
  };

  messages.push(newMessage);
  fs.writeFileSync("./JsonModeller/messages.json", JSON.stringify(messages));

  res.json(newMessage);
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// ------------------- START SERVER -------------------
app.listen(8080, () => console.log("Server kører på http://localhost:8080"));
