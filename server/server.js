// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import dbConnect from "./config/dbConnect.js";
import nodeRouter from "./routes/nodeRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;


app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));

app.use(express.json());

app.use("/api/nodes", nodeRouter);

app.use(notFound);
app.use(errorHandler);
try {
    await dbConnect();
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
} catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
}
