import authRouter from "./api/v1/auth/auth.controller";
import transactionsRouter from "./api/v1/transactions/transactions.http.controller";

import { Router } from "express";

const apiV1 = Router();

apiV1.use("/auth", authRouter);
apiV1.use("/transactions", transactionsRouter);

const routes = Router();
routes.use("/api/v1", apiV1);

export default routes;
