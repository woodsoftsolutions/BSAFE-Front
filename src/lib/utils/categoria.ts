// Utilidad para obtener la categoría por id
export function getCategoriaNombre(categorias: any[], categoriaId: number) {
  const categoria = categorias.find((c) => c.id === categoriaId);

  return categoria ? categoria.name : "-";
}
