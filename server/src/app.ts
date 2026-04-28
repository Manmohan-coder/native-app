import express, { Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhookHandler } from "./controllers/webhooks.js";
import ProductRouter from "./routes/product.routes.js";
import CartRouter from "./routes/cart.routes.js";
import OrderRouter from "./routes/order.routes.js";
import AddressRouter from "./routes/address.routes.js";
import AdminRouter from "./routes/admin.routes.js";
import WishlistRouter from "./routes/wishlist.routes.js";

const app = express();

app.use(clerkMiddleware())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.post('/api/clerk', express.raw({ type: "appliction/json" }), clerkWebhookHandler)

app.use('api/products', ProductRouter)
app.use('api/cart', CartRouter)
app.use('api/orders', OrderRouter)
app.use('api/addresses', AddressRouter)
app.use('api/admin', AdminRouter)
app.use('api/wishlist', WishlistRouter)

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!");
});

export default app;