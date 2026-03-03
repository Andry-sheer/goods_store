import mongoose from "mongoose";
import chalk from "chalk";

export const connectMDB = async () => {
  try {
    const connectCredential = process.env.MONGO_URI; 
    await mongoose.connect(connectCredential);
    console.log(chalk.green("Connect to MDB success!"));
  } catch (error) {
    console.error(chalk.red("Error connect to MDB", error.message));
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log(chalk.green("Mongoose connect success!"));
});

mongoose.connection.on("disconnected", () => {
  console.log(chalk.yellow("Mongoose disconnected"));
});

mongoose.connection.on("error", (err) => {
  console.error(chalk.red("Mongoose failed to connect", err.message));
});

const disconnectMDB = async () => {
  console.log(chalk.yellow("Disconnect from MDB with Ctrl + C"));
  await mongoose.connection.close();
  process.exit(0);
};

process.on("SIGINT", disconnectMDB);
