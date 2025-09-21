import express from "express";
import cors from "cors";
import { connectToMongo } from "./src/common/db.js";
import peliculaRoutes from "./src/pelicula/routes.js";
import actorRoutes from "./src/actor/routes.js";
import "dotenv/config"

// server.js
import express from "express";
import cors from "cors";
import "dotenv/config.js";              // lee .env en local (Render inyecta env)

import { connectToMongo } from "./src/common/db.js";
import peliculaRoutes from "./src/pelicula/routes.js";
import actorRoutes from "./src/actor/routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => res.status(200).send("Bienvenido al cine Iplacex"));

app.use("/api", peliculaRoutes);
app.use("/api", actorRoutes);

// 👇 Render define PORT, usa 3000 sólo si no existe (local)
const PORT = process.env.PORT || 3000;

connectToMongo()
  .then(() => {
    console.log("[Express] Conexión a Atlas OK");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Express] OK en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[Express] No se pudo iniciar: error Atlas →", err.message);
    process.exit(1);
  });
