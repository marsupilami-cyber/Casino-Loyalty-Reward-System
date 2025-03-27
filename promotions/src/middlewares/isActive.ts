import { Response, NextFunction } from "express";

import { ExtendedRequest } from "../utility/types";

const isActive = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  if (!req.active) {
    res.status(403).json({ message: "Access denied. User is deactivated." });
    return;
  }

  next();
};

export default isActive;
