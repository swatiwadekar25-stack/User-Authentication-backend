
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("MONGO_URI and JWT_SECRET must be configured in .env");
  process.exit(1);
}

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "https://user-authentication-backend-fronten.vercel.app"
    ]
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "User Authentication API is running"
  });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.use((error, req, res, next) => {
  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Request body must contain valid JSON"
    });
  }

  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      message: "Request body is too large"
    });
  }

  console.error(
    "Request failed:",
    error instanceof Error ? error.name : "UnknownError"
  );
  return res.status(500).json({
    message: "An unexpected error occurred"
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();
