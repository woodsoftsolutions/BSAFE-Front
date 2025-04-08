import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { getUsuarios } from "../fetch";

export async function UsuariosTabla() {
  const data = await getUsuarios();

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
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
              Usuario
            </TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Telefono</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((usuario) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={usuario.estado}
            >
              <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                <div>{usuario.usuario}</div>
              </TableCell>

              <TableCell>{usuario.estado}</TableCell>

              <TableCell>{usuario.correo}</TableCell>

              <TableCell>{usuario.telefono}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
