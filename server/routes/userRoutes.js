// IMPORTS
import express from "express";
import { getAllUsers, createNewUser, updateUser, deleteUser } from "../controllers/userController.js";
// CONFIGURATION
const router = express.Router();

// ROUTES
router.route("/")
    .get(getAllUsers)
    .post(createNewUser)
    .patch(updateUser)
    .delete(deleteUser);

export default router;