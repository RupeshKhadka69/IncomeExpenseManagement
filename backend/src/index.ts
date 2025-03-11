import { app } from "./app";
import connectDb from "./db";  // MongoDB connection
import dotenv from "dotenv";
import pgClient from "./db/postgres";  // PostgreSQL client

dotenv.config({
    path: './.env'
});

// First connect to MongoDB
connectDb()
  .then(() => {
    console.log("MongoDB connected successfully");

    // Since pgClient is already connected, no need to call `connect()` again
    console.log("PostgreSQL database already connected");
    
    // Start the server after database connections
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });

  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });

// Add a cleanup handler for graceful shutdown
process.on('SIGINT', async () => {
  try {
    await pgClient.end();
    console.log('PostgreSQL connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
});
