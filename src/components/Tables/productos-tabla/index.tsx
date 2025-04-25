import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { getProductos } from "../fetch";
import { cn } from "@/lib/utils";
import { TrashIcon , PencilSquareIcon } from "@/assets/icons";
export async function ProductosTabla() {
  const data = await getProductos();

  return (
      
    
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Top Products
        </h2>
      </div> */}
      {/* <div className="px-6 py-4">
        <input
          type="text"
          placeholder="Buscar proveedor..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99DFD8] dark:focus:ring-[#24726b]"
          onChange={(e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = data.filter((proveedor) =>
          proveedor.name.toLowerCase().includes(searchTerm)
        );
        // Update the table with filteredData
          }}
        />
      </div> */}
      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>
              Código
            </TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead className="text-right xl:pr-7.5">Opciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((producto) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={producto.codigo}
            >
              <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                <div>{producto.codigo}</div>
              </TableCell>
              <TableCell>{producto.descripcion}</TableCell>
              <TableCell>{producto.marca}</TableCell>

              <TableCell>{producto.categoria}</TableCell>

              <TableCell>
                <div
                                  className={cn(
                                    // "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                                    {
                                      "text-[#d34053]":
                                      producto.cantidad === 0,
                                      "text-[#FFA70B]":
                                      producto.cantidad > 0 && producto.cantidad <= 15,
                                      "text-green-500":
                                      producto.cantidad > 15,
                                    },
                                  )}
                                >
                                  {producto.cantidad}
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
    </div>
  );
}
