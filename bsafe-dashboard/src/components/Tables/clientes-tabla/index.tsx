import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { getClientes } from "../fetch";

export async function ClientesTabla() {
  const data = await getClientes();

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
              Cliente
            </TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Direccion</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Telefono</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((cliente) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={cliente.cliente}
            >
              <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                <div>{cliente.cliente}</div>
              </TableCell>

              <TableCell>{cliente.documento}</TableCell>

              <TableCell>{cliente.direccion}</TableCell>

              <TableCell>{cliente.correo}</TableCell>

              <TableCell>{cliente.telefono}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
