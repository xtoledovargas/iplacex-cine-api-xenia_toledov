
import { Router } from "express";
import {
  handleInsertPeliculaRequest,
  handleGetPeliculasRequest,
  handleGetPeliculaByIdRequest,
  handleUpdatePeliculaByIdRequest,
  handleDeletePeliculaByIdRequest
} from "./controller.js";

const peliculaRoutes = Router();

peliculaRoutes.post("/pelicula", handleInsertPeliculaRequest);
peliculaRoutes.get("/películas", handleGetPeliculasRequest);
peliculaRoutes.get("/película/:id", handleGetPeliculaByIdRequest);
peliculaRoutes.put("/película/:id", handleUpdatePeliculaByIdRequest);
peliculaRoutes.delete("/película/:id", handleDeletePeliculaByIdRequest);

peliculaRoutes.post("/pelicula", handleInsertPeliculaRequest);
peliculaRoutes.get("/peliculas", handleGetPeliculasRequest);
peliculaRoutes.get("/pelicula/:id", handleGetPeliculaByIdRequest);
peliculaRoutes.put("/pelicula/:id", handleUpdatePeliculaByIdRequest);
peliculaRoutes.delete("/pelicula/:id", handleDeletePeliculaByIdRequest);

export default peliculaRoutes;
