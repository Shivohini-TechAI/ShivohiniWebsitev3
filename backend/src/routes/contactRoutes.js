import express from "express";
import { submitContact } from "../controller/contactController.js";

const router = express.Router();

// POST /api/contact
router.post("/", submitContact);

export default router;
