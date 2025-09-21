import express from "express";
import cors from "cors";
import { connectToMongo } from "./src/common/db.js";
import peliculaRoutes from "./src/pelicula/routes.js";
import actorRoutes from "./src/actor/routes.js";
import "dotenv/config"
import { connectToMongo, getDb } from './src/common/db.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Health y raíz (Render chequea /healthz) ----
app.get('/healthz', (_req, res) => res.status(200).send('ok'));
app.get('/', (_req, res) => res.status(200).send('Bienvenido al cine Iplacex'));

// ---- Flag de base lista ----
let dbReady = false;
connectToMongo()
  .then(() => { dbReady = true; console.log('[MongoDB] Conexión OK'); })
  .catch(err => { console.error('[MongoDB] Error al conectar:', err.message); });

// Middleware: si DB no está lista, devolvé 503 (evita crashear el proceso)
app.use('/api', (req, res, next) => {
  if (!dbReady) return res.status(503).json({ message: 'Base no disponible, intente en unos segundos' });
  return next();
});

// ======== CRUD Películas (usa getDb() cuando haga falta) ========

app.post('/api/pelicula', async (req, res) => {
  try {
    const { nombre, generos = [], anioEstreno } = req.body;
    if (!nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });
    const doc = {
      nombre: String(nombre),
      generos: Array.isArray(generos) ? generos : [],
      anioEstreno: anioEstreno !== undefined ? Number(anioEstreno) : undefined
    };
    const { insertedId } = await getDb().collection('peliculas').insertOne(doc);
    return res.status(201).json({ _id: insertedId, ...doc });
  } catch (e) {
    return res.status(500).json({ message: 'Error al insertar', error: String(e) });
  }
});

app.get('/api/peliculas', async (_req, res) => {
  try {
    const docs = await getDb().collection('peliculas').find({}).toArray();
    return res.status(200).json(docs);
  } catch (e) {
    return res.status(500).json({ message: 'Error al obtener', error: String(e) });
  }
});

app.get('/api/pelicula/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const { id } = req.params;
    let oid; try { oid = new ObjectId(id); } catch { return res.status(400).json({ message: 'Id mal formado' }); }
    const doc = await getDb().collection('peliculas').findOne({ _id: oid });
    if (!doc) return res.status(404).json({ message: 'Recurso no encontrado' });
    return res.status(200).json(doc);
  } catch (e) {
    return res.status(500).json({ message: 'Error al obtener', error: String(e) });
  }
});

app.put('/api/pelicula/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const { id } = req.params;
    let oid; try { oid = new ObjectId(id); } catch { return res.status(400).json({ message: 'Id mal formado' }); }
    const updates = {};
    if (req.body.nombre !== undefined) updates.nombre = String(req.body.nombre);
    if (req.body.generos !== undefined) updates.generos = Array.isArray(req.body.generos) ? req.body.generos : [];
    if (req.body.anioEstreno !== undefined) updates.anioEstreno = Number(req.body.anioEstreno);
    const result = await getDb().collection('peliculas').updateOne({ _id: oid }, { $set: updates });
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Recurso no encontrado' });
    const updated = await getDb().collection('peliculas').findOne({ _id: oid });
    return res.status(200).json(updated);
  } catch (e) {
    return res.status(500).json({ message: 'Error al actualizar', error: String(e) });
  }
});

app.delete('/api/pelicula/:id', async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const { id } = req.params;
    let oid; try { oid = new ObjectId(id); } catch { return res.status(400).json({ message: 'Id mal formado' }); }
    const result = await getDb().collection('peliculas').deleteOne({ _id: oid });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Recurso no encontrado' });
    return res.status(200).json({ message: 'Eliminado' });
  } catch (e) {
    return res.status(500).json({ message: 'Error al eliminar', error: String(e) });
  }
});

// ---- Listener Render (PORT + 0.0.0.0) ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`[OK] Servidor escuchando en ${PORT}`));

// Cierre prolijo
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT',  () => process.exit(0));
