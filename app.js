import express from "express";
import session from "express-session";

// We only need these three route files
import authRoutes from "./routes/authRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";
import apiRoutes from "./routes/apiRoutes.js"; 

const app = express();

app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static("assets"));


app.use(session({
    secret: "hemligkode",
    resave: false,
    saveUninitialized: true
}));

// 1. Auth (Login/Logout)
app.use("/", authRoutes);

// 2. Views (The HTML Pages - The Client)
app.use("/", viewRoutes);

// 3. API (The Data - JSON)
app.use("/", apiRoutes);

app.listen(8080, () => console.log("Server running on http://localhost:8080"));