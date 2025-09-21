
import { ObjectId } from "mongodb";
import { getCollection } from "../common/db.js";
import { Actor } from "./actor.js";

const actorCollection = () => getCollection("actores");
const peliculaCollection = () => getCollection("peliculas");

export async function handleInsertActorRequest(req, res) {
  const { peliculaNombre, ...actorData } = req.body;
  if (!peliculaNombre) return res.status(400).json({ error: "Falta 'peliculaNombre'" });

  return peliculaCollection()
    .findOne({ nombre: peliculaNombre })
    .then(peli => {
      if (!peli) return res.status(404).json({ error: "Película no existe" });
      const doc = Actor({ ...actorData, idPelicula: String(peli._id) });
      return actorCollection().insertOne(doc)
        .then(r => res.status(201).json({ _id: r.insertedId, ...doc }));
    })
    .catch(e => res.status(500).json({ error: "Error al crear actor/actriz" }));
}

export async function handleGetActoresRequest(_req, res) {
  return actorCollection()
    .find({}).toArray()
    .then(data => res.status(200).json(data))
    .catch(e => res.status(500).json({ error: "Error al obtener actores" }));
}

export async function handleGetActorByIdRequest(req, res) {
  try {
    const _id = new ObjectId(req.params.id);
    return actorCollection()
      .findOne({ _id })
      .then(doc => {
        if (!doc) return res.status(404).json({ error: "Actor/actriz no encontrado" });
        return res.status(200).json(doc);
      })
      .catch(e => res.status(500).json({ error: "Error al obtener actor/actriz" }));
  } catch {
    return res.status(400).json({ error: "Id mal formado" });
  }
}

export async function handleGetActoresByPeliculaIdRequest(req, res) {
  const peliculaId = String(req.params.pelicula);
  return actorCollection()
    .find({ idPelicula: peliculaId }).toArray()
    .then(data => res.status(200).json(data))
    .catch(e => res.status(500).json({ error: "Error al obtener actores por película" }));
}
