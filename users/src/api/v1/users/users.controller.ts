import { UserService } from "./users.service";

import express from "express";

const userService = new UserService();

const router = express.Router();

router.post("/", async (req, res, next) => {});

export default router;
