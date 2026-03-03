import dotenv from "dotenv";
import app from "./app.js";
import { connectMDB } from "./config/database.config.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

const launchServer = async () => {
  try {
    await connectMDB();
    app.listen(PORT, () => {
      console.log(`Server launch at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to launch Server:", error);
    process.exit(1);
  }
};

launchServer();
