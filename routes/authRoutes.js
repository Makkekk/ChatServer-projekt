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
  const users = JSON.parse(fs.readFileSync("./JsonModeller/users.json"));

  res.render("includes/listeSide", {
    username: req.session.user.username,
    niveau: req.session.user.niveau,
    chats: userChats,
    users: users
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



// DELETE /users/:id
router.delete("/users/:id", (req, res) => {
    // 1. Tjek om brugeren er logget ind og er admin
    if (!req.session.user || req.session.user.niveau !== 3) {
        return res.status(403).json({ error: "Adgang nægtet" });
    }

    // 2. Læs bruger-filen
    const users = JSON.parse(fs.readFileSync("./JsonModeller/users.json"));

    // 3. Find og slet brugeren
    const userId = req.params.id;
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: "Bruger ikke fundet" });
    }

    // Ekstra sikkerhed: Slet ikke den sidste admin-bruger
    if (users[userIndex].niveau === 3) {
        const adminCount = users.filter(u => u.niveau === 3).length;
        if (adminCount <= 1) {
            return res.status(400).json({ error: "Kan ikke slette den sidste admin" });
        }
    }
    
    // Tjek om admin prøver at slette sig selv
    if (users[userIndex].id === req.session.user.id) {
        return res.status(400).json({ error: "Du kan ikke slette dig selv" });
    }


    users.splice(userIndex, 1);

    // 4. Gem ændringerne
    fs.writeFileSync("./JsonModeller/users.json", JSON.stringify(users));

    // 5. Send succes-svar
    res.json({ success: true, message: "Bruger slettet" });
});

export default router;
