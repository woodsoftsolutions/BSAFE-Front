import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TrashIcon, PencilSquareIcon } from "@/assets/icons";
import { Producto, SortConfig } from "@/types";
import { useState } from "react";

interface InventarioTablaProps {
  searchTerm: string;
  sortConfig: SortConfig | null;
  selectedCategory: string;
  onSort: (key: keyof Producto) => void;
  getFilteredAndSortedData: (data: Producto[]) => Producto[];
}

export function InventarioTabla({
  searchTerm,
  sortConfig,
  selectedCategory,
  onSort,
  getFilteredAndSortedData,
}: InventarioTablaProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Simulación de datos obtenidos
  const data: Producto[] = [
    { id: 1, nombre: "Laptop HP", tipo: "Electrónica", stock: 10, stockMinimo: 5, precio: 1500, categoria: "electronica" },
    { id: 2, nombre: "Camiseta Nike", tipo: "Ropa", stock: 20, stockMinimo: 10, precio: 25, categoria: "ropa" },
    { id: 3, nombre: "Smartphone Samsung", tipo: "Electrónica", stock: 5, stockMinimo: 3, precio: 800, categoria: "electronica" },
    { id: 4, nombre: "Pantalón Levi's", tipo: "Ropa", stock: 15, stockMinimo: 5, precio: 50, categoria: "ropa" },
    { id: 5, nombre: "Auriculares Sony", tipo: "Electrónica", stock: 8, stockMinimo: 4, precio: 100, categoria: "electronica" },
    { id: 6, nombre: "Zapatos Adidas", tipo: "Ropa", stock: 12, stockMinimo: 6, precio: 75, categoria: "ropa" },
    { id: 7, nombre: "Monitor LG", tipo: "Electrónica", stock: 7, stockMinimo: 3, precio: 200, categoria: "electronica" },
    { id: 8, nombre: "Teclado Mecánico", tipo: "Electrónica", stock: 10, stockMinimo: 5, precio: 120, categoria: "electronica" },
    { id: 9, nombre: "Chaqueta North Face", tipo: "Ropa", stock: 6, stockMinimo: 2, precio: 150, categoria: "ropa" },
    { id: 10, nombre: "Mouse Logitech", tipo: "Electrónica", stock: 20, stockMinimo: 10, precio: 50, categoria: "electronica" },
    { id: 11, nombre: "Tablet Apple", tipo: "Electrónica", stock: 3, stockMinimo: 2, precio: 900, categoria: "electronica" },
    { id: 12, nombre: "Vestido Zara", tipo: "Ropa", stock: 10, stockMinimo: 5, precio: 60, categoria: "ropa" },
    { id: 13, nombre: "Cargador Universal", tipo: "Electrónica", stock: 25, stockMinimo: 10, precio: 20, categoria: "electronica" },
    { id: 14, nombre: "Gorra Puma", tipo: "Ropa", stock: 18, stockMinimo: 8, precio: 15, categoria: "ropa" },
    { id: 15, nombre: "Cámara Canon", tipo: "Electrónica", stock: 4, stockMinimo: 2, precio: 500, categoria: "electronica" },
  ];

  // Filtrar y ordenar los datos utilizando las funciones proporcionadas
  const filteredAndSortedData = getFilteredAndSortedData(data);

  // Calcular los datos para la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead onClick={() => onSort("nombre")}>Producto</TableHead>
            <TableHead onClick={() => onSort("tipo")}>Categoria</TableHead>
            <TableHead onClick={() => onSort("stock")}>Cantidad</TableHead>
            <TableHead onClick={() => onSort("precio")}>Precio</TableHead>
            <TableHead>Estatus</TableHead>
            <TableHead className="text-right xl:pr-7.5">Opciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedData.map((inventario) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={inventario.id}
            >
              <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                <div>{inventario.nombre}</div>
              </TableCell>
              <TableCell>{inventario.tipo}</TableCell>
              <TableCell>{inventario.stock}</TableCell>
              <TableCell>${inventario.precio}</TableCell>
              <TableCell>
                <div
                  className={cn(
                    "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                    {
                      "bg-[#219653]/[0.08] text-[#219653]":
                        inventario.stock > inventario.stockMinimo,
                      "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                        inventario.stock <= inventario.stockMinimo &&
                        inventario.stock > 0,
                      "bg-[#D34053]/[0.08] text-[#D34053]":
                        inventario.stock === 0,
                    }
                  )}
                >
                  {inventario.stock > inventario.stockMinimo
                    ? "En Stock"
                    : inventario.stock <= inventario.stockMinimo &&
                      inventario.stock > 0
                    ? "Stock Bajo"
                    : "Agotado"}
                </div>
              </TableCell>

              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button className="hover:text-primary">
                    <span className="sr-only">Editar</span>
                    <PencilSquareIcon />
                  </button>

                  <button className="hover:text-primary">
                    <span className="sr-only">Eliminar</span>
                    <TrashIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}