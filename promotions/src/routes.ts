import promotionRouter from "./api/v1/promotions/promotions.controller";

import { Router } from "express";

const apiV1 = Router();

apiV1.use("/promotions", promotionRouter);

const routes = Router();
routes.use("/api/v1", apiV1);

export default routes;
