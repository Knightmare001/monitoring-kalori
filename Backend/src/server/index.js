import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "../routes/index.js";
import connectDB from "../config/db.js";
import ErrorHandler from "../middleware/error.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(ErrorHandler);

export default app;
