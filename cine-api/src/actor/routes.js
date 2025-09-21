
import { Router } from "express";
import {
  handleInsertActorRequest,
  handleGetActoresRequest,
  handleGetActorByIdRequest,
  handleGetActoresByPeliculaIdRequest
} from "./controller.js";

const router = Router();

router.post("/actor", handleInsertActorRequest);
router.get("/actores", handleGetActoresRequest);


router.get("/actor/:param", (req, res) => {
  const value = String(req.params.param);

  
  if (/^[a-fA-F0-9]{24}$/.test(value)) {
    req.params.id = value;
    return handleGetActorByIdRequest(req, res);
  }


  req.params.pelicula = value;
  return handleGetActoresByPeliculaIdRequest(req, res);
});

export default router;
