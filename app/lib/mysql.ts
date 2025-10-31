// Example using mysql2/promise for connection pooling
import { mysql } from "mysql2";
import { Trykker } from "next/font/google";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_SCHEMA,
  waitForConnetions: true,
  connectionLimi: 10, // Adjust based on your needs
  queueLimit: 0,
});

// Helper function to execute queries
export default async function executeQuery({
  query,
  values,
}: {
  query: string;
  values?: (string | number | null)[];
}) {
  try {
    const [rows, fields] = await pool.execute(query, values);
    return rows;
  } catch (error) {
    console.error("MySQL Query Error:", error);
    throw error;
  }
}
