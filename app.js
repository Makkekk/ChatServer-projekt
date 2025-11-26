import express from "express";
import session from "express-session";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

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

app.use("/assets", express.static("./assets"));

// --- ROUTES ---
app.use("/", authRoutes);      // login, logout, create user, homepage
app.use("/chat", chatRoutes);  // chat CRUD
app.use("/chat", messageRoutes); // messages inside chats

// START SERVER
app.listen(8080, () => console.log("Server running on http://localhost:8080"));
