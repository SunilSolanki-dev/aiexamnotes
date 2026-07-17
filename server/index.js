import express from 'express';
import dotenv from 'dotenv';
import connectDb from './utils/connectDb.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
import userRouter from './routes/user.route.js';
import notesRouter from './routes/genrate.route.js';
import creditRouter from './routes/credits.route.js';
import { stripeWebhook } from './controllers/credits.controller.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.post(
  "/api/credits/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true,
  methods:["GET","POST","PUT","DELETE","OPTIONS"]

}))

app.get('/', (req, res) => {
    res.json({ message: "ExamNotes AI backend running" });
})

app.use("/api/auth",authRouter)
app.use('/api/user',userRouter)
app.use('/api/notes',notesRouter)
app.use('/api/credits',creditRouter)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  connectDb()
})