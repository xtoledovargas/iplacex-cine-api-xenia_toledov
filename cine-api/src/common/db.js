// src/common/db.js
import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

export const DB_NAME = process.env.DB_NAME || 'cine-db';
const DB_URI = process.env.MONGODB_URI; // <- viene de Render/ .env local

if (!DB_URI) {
  throw new Error('[MongoDB] Falta la variable MONGODB_URI');
}

let client;
let db;

export async function connectToMongo() {
  if (db) return db;

  client = new MongoClient(DB_URI, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    serverSelectionTimeoutMS: 10000,
  });

  console.log('[MongoDB] Conectando a Atlas…');
  await client.connect();
  db = client.db(DB_NAME);
  await db.command({ ping: 1 });
  console.log(`[MongoDB] Conectado | DB: ${DB_NAME}`);
  return db;
}

export function getDb() {
  if (!db) throw new Error('DB no inicializada. Ejecutá connectToMongo() primero.');
  return db;
}

export function getCollection(name) {
  return getDb().collection(name);
}

export async function closeMongo() {
  try { if (client) await client.close(); }
  finally { client = undefined; db = undefined; }
}

process.on('SIGINT', () => closeMongo().finally(() => process.exit(0)));
process.on('SIGTERM', () => closeMongo().finally(() => process.exit(0)));
