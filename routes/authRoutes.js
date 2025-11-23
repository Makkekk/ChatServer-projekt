import express from "express";
import { login, logout, createAccount, loginPage, createPage } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", loginPage);
router.post("/login", login);
router.get("/logout", logout);

router.get("/createAccount", createPage);
router.post("/opret-bruger", createAccount);

router.get("/", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("index", {
        username: req.session.user.username,
        niveau: req.session.user.niveau
    });
});

export default router;
