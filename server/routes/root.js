// IMPORTS
import express from "express";
import path from "path";
import * as url from "url";
// CONFIGURATION
const router = express.Router();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ROUTES
router.get("|index(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

export default router;