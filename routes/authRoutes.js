import express from "express";
import { getUsers, saveUsers } from "../utils/db.js";

const router = express.Router();

router.post("/loginForm", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) return res.status(401).send("Wrong login");
    
    req.session.user = user;
    res.sendStatus(200);
});

router.post("/createAccount", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const users = getUsers();

    if (users.find(u => u.username === username)) return res.status(409).send("User exists");
    const newUser = {
        id: Date.now().toString(),
        username: username,
        password: password,
        level: 1,
        date: new Date().toLocaleDateString('da-DK')
    };
    users.push(newUser);
    saveUsers(users);
    res.sendStatus(201);
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
});

export default router;