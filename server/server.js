// IMPORTS
import express from "express";
import path from "path";
import * as url from "url";
import dotenv from "dotenv";
import rootRoutes from "./routes/root.js";
// CONFIGURATION
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3001;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// FIND RESOURCES
app.use("/", express.static(path.join(__dirname, "public")));

// 3500 ROUTES
app.use("/", rootRoutes);
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    }
    else if (req.accepts(json)) {
        res.json({ message: "404 Not Found" });
    }
    else {
        res.type(".txt").send("404 Not Found");
    }
})

// RUN
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));