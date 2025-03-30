import promotionRouter from "./api/v1/promotions/promotions.controller";

import { Router } from "express";

import accessTokenMiddleware from "./middlewares/accessToken";
import isActive from "./middlewares/isActive";

const apiV1 = Router();

apiV1.use(accessTokenMiddleware);
apiV1.use(isActive);

apiV1.use("/promotions", promotionRouter);

const routes = Router();
routes.use("/api/v1", apiV1);

export default routes;
