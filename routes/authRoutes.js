import express from "express";
import fs from "fs";

const router = express.Router();

// GET homepage
router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.render("includes/landingPage");
  }

  const chats = JSON.parse(fs.readFileSync("./JsonModeller/chats.json"));
  const userChats = chats.filter(chat => chat.ejer === req.session.user.username);

  res.render("includes/listeSide", {
    username: req.session.user.username,
    niveau: req.session.user.niveau,
    chats: userChats,
    users: []
  });
});

// GET /loginForm
router.get("/loginForm", (req, res) => res.render("includes/loginForm"));

// POST /loginForm
router.post("/loginForm", (req, res) => {
  const { brugernavn, adgangskode } = req.body;
  const users = JSON.parse(fs.readFileSync("./JsonModeller/users.json"));

  const user = users.find(
    u => u.username === brugernavn && u.password === adgangskode
  );

  if (!user) return res.status(401).send("Forkert login");

  req.session.user = user;
  res.redirect("/");
});

// GET /logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// GET /createAccount 
router.get("/createAccount", (req, res) => {
  res.render("includes/createAccount");
});

// POST /createAccount
router.post("/opret-bruger", (req, res) => {
  const { brugernavn, adgangskode } = req.body;

  const users = JSON.parse(fs.readFileSync("./JsonModeller/users.json"));

  if (users.find(u => u.username === brugernavn))
    return res.status(409).send("Brugernavn allerede taget");

  const newUser = {
    id: Date.now().toString(),
    username: brugernavn,
    password: adgangskode,
    niveau: 1,
    dato: new Date()
  };

  users.push(newUser);
  fs.writeFileSync("./JsonModeller/users.json", JSON.stringify(users));
  res.redirect("/loginForm");
});


export default router;
