import { Response, NextFunction } from "express";

import { ExtendedRequest, RolesEnum } from "../utility/types";

const authorizeAdmin = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  if (req.role !== RolesEnum.ADMIN) {
    res.status(403).json({ message: "Access denied. Admins only." });
    return;
  }

  next();
};

export default authorizeAdmin;
