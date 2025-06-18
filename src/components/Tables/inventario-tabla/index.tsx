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
import { useEffect, useState, useRef } from "react";
import React from "react";
import { API_BASE_URL } from "@/lib/constants";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCategoriaNombre } from "@/lib/utils/categoria";

export default function InventarioTabla() {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historial, setHistorial] = useState<any[] | null>(null);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [historialError, setHistorialError] = useState<string | null>(null);
  const [historialProducto, setHistorialProducto] = useState<any | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const cacheRef = useRef<{ [key: string]: any[] }>({});

  const fetchMovimientos = async (pageIndex = 0, pageSize = 10) => {
    const cacheKey = `${pageIndex}_${pageSize}`;
    if (cacheRef.current[cacheKey]) {
      setMovimientos(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory-balances/paginated?per_page=${pageSize}&page=${pageIndex + 1}`);
      if (!res.ok) throw new Error("Error al cargar movimientos de inventario");
      const data = await res.json();
      const movimientosData = Array.isArray(data.data) ? data.data : data.data?.data || [];
      cacheRef.current[cacheKey] = movimientosData;
      setMovimientos(movimientosData);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProductos(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      // Manejo de error opcional
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await res.json();
      setCategorias(Array.isArray(data.data?.categorias) ? data.data.categorias : []);
    } catch (err) {
      setCategorias([]);
    }
  };

  useEffect(() => {
    fetchMovimientos(page, rowsPerPage);
    fetchProductos();
    fetchCategorias();
  }, [page, rowsPerPage]);

  // Helper to get status
  const getStatus = (cantidad: number, minimo: number) => {
    if (cantidad > minimo) return { label: "En Stock", color: "bg-[#219653]/[0.08] text-[#219653]" };
    if (cantidad <= minimo && cantidad > 0) return { label: "Stock Bajo", color: "bg-[#FFA70B]/[0.08] text-[#FFA70B]" };
    return { label: "Agotado", color: "bg-[#D34053]/[0.08] text-[#D34053]" };
  };

  const handleVerHistorial = async (producto: any) => {
    setHistorialLoading(true);
    setHistorialError(null);
    setHistorial(null);
    setHistorialProducto(producto);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory-movements/product/${producto.id}`);
      if (!res.ok) throw new Error("Error al cargar historial");
      const data = await res.json();
      setHistorial(Array.isArray(data.data) ? data.data : []);
    } catch (err: any) {
      setHistorialError(err.message || "Error desconocido");
    } finally {
      setHistorialLoading(false);
    }
  };

  const handleVolver = () => {
    setHistorial(null);
    setHistorialProducto(null);
    setHistorialError(null);
  };

  const exportToCSV = () => {
    const headers = ["Producto", "Cantidad", "Stock mínimo", "Unidad", "Estado"];
    const rows = movimientos.map(m => [
      m.product?.name, m.quantity, m.minimum_stock, m.unit?.name, m.status
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventario.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = [["Producto", "Cantidad", "Stock mínimo", "Unidad", "Estado"]];
    const rows = movimientos.map(m => [
      m.product?.name, m.quantity, m.minimum_stock, m.unit?.name, m.status
    ]);
    autoTable(doc, { head: headers, body: rows });
    doc.save("inventario.pdf");
  };

  // Exportar historial a CSV
  const exportHistorialToCSV = () => {
    if (!historialProducto || !historial) return;
    const headers = ["ID", "Tipo", "Cantidad", "Costo Unitario", "Almacén", "Empleado", "Fecha"];
    const rows = historial.map(mov => [
      mov.id,
      mov.movement_type === 'entry' ? 'Entrada al Inventario' : mov.movement_type === 'exit' ? 'Salida de inventario' : mov.movement_type,
      mov.quantity,
      mov.unit_cost ?? '-',
      mov.warehouse?.name || '-',
      mov.employee ? `${mov.employee.first_name} ${mov.employee.last_name}` : '-',
      mov.created_at ? new Date(mov.created_at).toLocaleString() : '-'
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `historial_${historialProducto.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exportar historial a PDF
  const exportHistorialToPDF = () => {
    if (!historialProducto || !historial) return;
    const doc = new jsPDF();
    const headers = [["ID", "Tipo", "Cantidad", "Costo Unitario", "Almacén", "Empleado", "Fecha"]];
    const rows = historial.map(mov => [
      mov.id,
      mov.movement_type === 'entry' ? 'Entrada al Inventario' : mov.movement_type === 'exit' ? 'Salida de inventario' : mov.movement_type,
      mov.quantity,
      mov.unit_cost ?? '-',
      mov.warehouse?.name || '-',
      mov.employee ? `${mov.employee.first_name} ${mov.employee.last_name}` : '-',
      mov.created_at ? new Date(mov.created_at).toLocaleString() : '-'
    ]);
    autoTable(doc, { head: headers, body: rows });
    doc.save(`historial_${historialProducto.name}.pdf`);
  };

  if (loading) return <div className="p-4">Cargando inventario...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  // Vista de historial de movimientos
  if (historial !== null && historialProducto) {
    return (
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-4">
        <button onClick={handleVolver} className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Volver</button>
        <h2 className="text-lg font-bold mb-2">Historial de movimientos para: {historialProducto.name}</h2>
        {historialLoading ? (
          <div className="p-4">Cargando historial...</div>
        ) : historialError ? (
          <div className="p-4 text-red-500">{historialError}</div>
        ) : (
          <>
            <div className="flex gap-2 mb-4 justify-end">
              <button
                onClick={exportHistorialToPDF}
                className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/80 transition-colors"
              >
                Descargar PDF
              </button>
              <button
                onClick={exportHistorialToCSV}
                className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/80 transition-colors"
              >
                Descargar CSV
              </button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3">
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Costo Unitario</TableHead>
                  <TableHead>Almacén</TableHead>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((mov) => (
                  <TableRow key={mov.id} className="text-base font-medium text-dark dark:text-white">
                    <TableCell>{mov.id}</TableCell>
                    <TableCell>
                      <span
                        className={
                          mov.movement_type === 'entry'
                            ? 'text-green-600 font-semibold'
                            : mov.movement_type === 'exit'
                            ? 'text-red-600 font-semibold'
                            : ''
                        }
                      >
                        {mov.movement_type === 'entry'
                          ? 'Entrada al Inventario'
                          : mov.movement_type === 'exit'
                          ? 'Salida de inventario'
                          : mov.movement_type}
                      </span>
                    </TableCell>
                    <TableCell>{mov.quantity}</TableCell>
                    <TableCell>{mov.unit_cost ?? '-'}</TableCell>
                    <TableCell>{mov.warehouse?.name || '-'}</TableCell>
                    <TableCell>{mov.employee ? `${mov.employee.first_name} ${mov.employee.last_name}` : '-'}</TableCell>
                    <TableCell>{mov.created_at ? new Date(mov.created_at).toLocaleString() : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    );
  }

  // Columnas para MaterialReactTable
  const columns = [
    {
      accessorKey: "product.name",
      header: "Producto",
      Cell: ({ cell, row }: any) => (
        <Typography sx={{ fontWeight: 500 }}>{row.original.product?.name || "-"}</Typography>
      ),
    },
    {
      accessorKey: "category_id",
      header: "Categoría",
      Cell: ({ row }: any) => getCategoriaNombre(categorias, row.original.category_id),
    },
    { accessorKey: "quantity", header: "Cantidad" },
    { accessorKey: "unit_cost", header: "Precio", Cell: ({ row }: any) => row.original.unit_cost ? `$${row.original.unit_cost}` : "-" },
    { accessorKey: "total", header: "Precio total", Cell: ({ row }: any) => row.original.unit_cost && row.original.quantity ? `$${row.original.unit_cost * row.original.quantity}` : "-" },
    { accessorKey: "warehouse.name", header: "Almacén", Cell: ({ row }: any) => row.original.warehouse?.name || "-" },
    { accessorKey: "status", header: "Estatus", Cell: ({ row }: any) => {
      const status = getStatus(row.original.quantity, row.original.minimum_stock ?? 0);
      return <div className={`max-w-fit rounded-full px-3.5 py-1 text-sm font-medium ${status.color}`}>{status.label}</div>;
    } },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <div className="flex justify-end gap-2 mb-2">
        <button onClick={exportToPDF} className="bg-primary text-white px-3 py-1 rounded">Descargar PDF</button>
        <button onClick={exportToCSV} className="bg-primary text-white px-3 py-1 rounded">Descargar CSV</button>
      </div>
      <MaterialReactTable
        columns={columns}
        data={movimientos}
        state={{ isLoading: loading, pagination: { pageIndex: page, pageSize: rowsPerPage } }}
        enableFullScreenToggle={false}
        enableRowActions
        positionActionsColumn="last"
        onPaginationChange={(updater) => {
          const next = typeof updater === 'function' ? updater({ pageIndex: page, pageSize: rowsPerPage }) : updater;
          setPage(next.pageIndex);
          setRowsPerPage(next.pageSize);
        }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <IconButton onClick={() => handleVerHistorial(row.original)} size="small">
              <VisibilityIcon fontSize="small" />
            </IconButton>
            {/* Aquí puedes agregar más iconos si implementas editar/eliminar */}
          </Box>
        )}
        muiTablePaperProps={{
          elevation: 2,
          sx: {
            borderRadius: "10px",
            overflow: "hidden",
          },
        }}
        muiTableContainerProps={{
          sx: {
            maxHeight: "600px",
          },
        }}
        muiTableHeadCellProps={{
          sx: { fontWeight: "bold", fontFamily: "Satoshi" },
        }}
        muiTableBodyCellProps={{
          sx: { fontSize: "0.95rem", fontFamily: "Satoshi" },
        }}
        muiPaginationProps={{
          rowsPerPageOptions: [5, 10, 20],
        }}
      />
    </Box>
  );
}