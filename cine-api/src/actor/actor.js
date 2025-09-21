
export function Actor(input = {}) {
  return {
    idPelicula: String(input.idPelicula ?? "").trim(),
    nombre: String(input.nombre ?? "").trim(),
    edad: Number(input.edad),
    estaRetirado: Boolean(input.estaRetirado),
    premios: Array.isArray(input.premios) ? input.premios.map(String) : []
  };
}
