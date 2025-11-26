import express from "express";
import { getUsers, saveUsers } from "../utils/db.js";

const router = express.Router();

router.post("/loginForm", (req, res) => {
    const { brugernavn, adgangskode } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === brugernavn && u.password === adgangskode);

    if (!user) return res.status(401).send("Wrong login");
    
    req.session.user = user;
    res.redirect("/");
});

router.post("/createAccount", (req, res) => {
    const { brugernavn, adgangskode } = req.body;
    const users = getUsers();
    
    if (users.find(u => u.username === brugernavn)) return res.status(409).send("User exists");

    const newUser = {
        id: Date.now().toString(),
        username: brugernavn,
        password: adgangskode,
        niveau: 1, 
        dato: new Date()
    };
    users.push(newUser);
    saveUsers(users);
    res.redirect("/loginForm");
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
});

export default router;