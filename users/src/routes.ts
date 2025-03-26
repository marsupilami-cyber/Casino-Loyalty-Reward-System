import authRouter from "./api/v1/auth/auth.controller";

import { Router } from "express";

const apiV1 = Router();

apiV1.use("/auth", authRouter);

const routes = Router();
routes.use("/api/v1", apiV1);

export default routes;
