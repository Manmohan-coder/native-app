import express, { Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhookHandler } from "./controllers/webhooks.js";
import ProductRouter from "./routes/product.routes.js";

const app = express();

app.use(clerkMiddleware())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.post('/api/clerk', express.raw({ type: "appliction/json" }), clerkWebhookHandler)

app.use('api/products', ProductRouter)

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!");
});

export default app;