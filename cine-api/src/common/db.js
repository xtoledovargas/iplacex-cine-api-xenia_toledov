import { MongoClient, ServerApiVersion } from "mongodb";

export const DB_NAME = "cine-db";

const DB_URI =
  "mongodb+srv://eva3_express:MjwWz9cYHpGAKTwY@cluster-express.gc2p6lf.mongodb.net/?retryWrites=true&w=majority&appName=cluster-express";

let client;
let db;

export async function connectToMongo() {
  if (db) return db; 
  client = new MongoClient(DB_URI, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    serverSelectionTimeoutMS: 7000,
  });

  console.log("[MongoDB] Intentando conectar a Atlas…");
  await client.connect();
  await client.db(DB_NAME).command({ ping: 1 }); 
  db = client.db(DB_NAME);
  console.log(`[MongoDB] Conectado a Atlas | DB: ${DB_NAME}`);
  return db;
}

export function getDb() {
  if (!db) throw new Error("DB no inicializada. Llamá connectToMongo() primero.");
  return db;
}

export function getCollection(name) {
  return getDb().collection(name);
}

// Cierre limpio (opcional)
process.on("SIGINT", async () => {
  try { if (client) await client.close(); } finally { process.exit(0); }
});
