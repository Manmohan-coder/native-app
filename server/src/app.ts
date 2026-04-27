import express, { Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(clerkMiddleware())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!");
});

export default app;