import express from "express";

const router = express.Router();

router.post("add-transaction", (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default router;
