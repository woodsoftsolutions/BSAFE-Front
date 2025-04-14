import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { getCotizacion } from "../fetch";
import { cn } from "@/lib/utils";
import { TrashIcon , PencilSquareIcon } from "@/assets/icons";

export async function CotizacionTabla() {
  const data = await getCotizacion();

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
              Fecha
            </TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Costo</TableHead>
            <TableHead>Estatus</TableHead>
            <TableHead className="text-right xl:pr-7.5">Opciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((cotizacion) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={cotizacion.fecha}
            >
              <TableCell >
                <div>{cotizacion.fecha}</div>
              </TableCell>
              <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5" >
                {cotizacion.cliente}
                </TableCell>
              <TableCell>${cotizacion.costo}</TableCell>
              <TableCell>
                <div
                  className={cn(
                    "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                    {
                      "bg-[#219653]/[0.08] text-[#219653]":
                      cotizacion.estatus === "Aprobada",
                      "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                      cotizacion.estatus === "Pendiente",
                      "bg-[#D34053]/[0.08] text-[#D34053]":
                      cotizacion.estatus === "Rechazada",
                      
                    },
                  )}
                >
                    {cotizacion.estatus}
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
