import { Response, NextFunction } from "express";

import { ExtendedRequest, RolesEnum } from "../utility/types";

const authorizeNotPlayer = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  if (req.role === RolesEnum.PLAYER) {
    res.status(403).json({ message: "Access denied. Admins and staffs only." });
    return;
  }

  next();
};

export default authorizeNotPlayer;
