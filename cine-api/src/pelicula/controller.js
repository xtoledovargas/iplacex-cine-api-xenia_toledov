
import { ObjectId } from "mongodb";
import { getCollection } from "../common/db.js";
import { Pelicula } from "./pelicula.js";


const peliculaCollection = () => getCollection("peliculas");

export async function handleInsertPeliculaRequest(req, res) {
  const doc = Pelicula(req.body);
  return peliculaCollection()
    .insertOne(doc)
    .then(r => res.status(201).json({ _id: r.insertedId, ...doc }))
    .catch(e => res.status(500).json({ error: "Error al crear película" }));
}

export async function handleGetPeliculasRequest(_req, res) {
  return peliculaCollection()
    .find({}).toArray()
    .then(data => res.status(200).json(data))
    .catch(e => res.status(500).json({ error: "Error al obtener películas" }));
}

export async function handleGetPeliculaByIdRequest(req, res) {
  try {
    const _id = new ObjectId(req.params.id);
    return peliculaCollection()
      .findOne({ _id })
      .then(doc => {
        if (!doc) return res.status(404).json({ error: "Película no encontrada" });
        return res.status(200).json(doc);
      })
      .catch(e => res.status(500).json({ error: "Error al obtener película" }));
  } catch {
    return res.status(400).json({ error: "Id mal formado" });
  }
}

export async function handleUpdatePeliculaByIdRequest(req, res) {
  try {
    const _id = new ObjectId(req.params.id);
    const $set = Pelicula(req.body);
    return peliculaCollection()
      .updateOne({ _id }, { $set })
      .then(r => {
        if (!r.matchedCount) return res.status(404).json({ error: "Película no encontrada" });
        return peliculaCollection().findOne({ _id });
      })
      .then(updated => res.status(200).json(updated))
      .catch(e => res.status(500).json({ error: "Error al actualizar película" }));
  } catch {
    return res.status(400).json({ error: "Id mal formado" });
  }
}

export async function handleDeletePeliculaByIdRequest(req, res) {
  try {
    const _id = new ObjectId(req.params.id);
    return peliculaCollection()
      .deleteOne({ _id })
      .then(r => {
        if (!r.deletedCount) return res.status(404).json({ error: "Película no encontrada" });
        return res.status(200).json({ ok: true });
      })
      .catch(e => res.status(500).json({ error: "Error al eliminar película" }));
  } catch {
    return res.status(400).json({ error: "Id mal formado" });
  }
}
