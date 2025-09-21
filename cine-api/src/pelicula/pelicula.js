export function Pelicula(input = {}) {
  const generos = input.generos ?? input["géneros"] ?? [];
  return {
    nombre: String(input.nombre ?? "").trim(),
    generos: Array.isArray(generos) ? generos.map(String) : [],
    anioEstreno: Number(input.anioEstreno)
  };
}