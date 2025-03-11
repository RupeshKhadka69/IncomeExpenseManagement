import { Client } from "pg";

const dbConfig = {
  user: "postgres",
  host: "localhost",
  database: "my_new_db",
  password: "your_password",
  port: 5432,
};

const client = new Client(dbConfig);

client
  .connect()
  .then(() => {
    console.log("PostgreSQL database connected");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL:", err);
  });

export default client;
