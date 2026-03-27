import express from "express"
import { configDotenv } from "dotenv";
import connectDb from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import todoRoutes from "./routes/todo.routes.js"

configDotenv()

const app = express();

connectDb();

const PORT = process.env.PORT;

app.use(express.json());

app.use(cors({origin: process.env.FRONTEND_URL, methods:["GET","POST", "PUT", "DELETE"], credentials:true}));
app.use("/api",userRoutes);
app.use("/api", todoRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.get("/health", (req, res) => {
    res.send("OK");
})