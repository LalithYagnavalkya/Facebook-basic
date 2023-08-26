import express from "express";
import cors from "cors";
import router from "./routes/router";

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/api/v1/', router);

export default app;
