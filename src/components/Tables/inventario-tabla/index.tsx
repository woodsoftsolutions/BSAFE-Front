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
import { useEffect, useState } from "react";
import React from "react";
import { API_BASE_URL } from "@/lib/constants";

export default function InventarioTabla() {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historial, setHistorial] = useState<any[] | null>(null);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [historialError, setHistorialError] = useState<string | null>(null);
  const [historialProducto, setHistorialProducto] = useState<any | null>(null);

  const fetchMovimientos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory-balances`);
      if (!res.ok) throw new Error("Error al cargar movimientos de inventario");
      const data = await res.json();
      setMovimientos(Array.isArray(data) ? data : (data.data || data.results || []));
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

  useEffect(() => {
    fetchMovimientos();
    fetchProductos();
  }, []);

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
                  <TableCell>{mov.movement_type}</TableCell>
                  <TableCell>{mov.quantity}</TableCell>
                  <TableCell>{mov.unit_cost ?? '-'}</TableCell>
                  <TableCell>{mov.warehouse?.name || '-'}</TableCell>
                  <TableCell>{mov.employee ? `${mov.employee.first_name} ${mov.employee.last_name}` : '-'}</TableCell>
                  <TableCell>{mov.created_at ? new Date(mov.created_at).toLocaleString() : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  }

  // Vista principal
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Producto</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Precio total</TableHead>
            <TableHead>Almacén</TableHead>
            <TableHead>Historial</TableHead>
            <TableHead>Estatus</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movimientos.map((mov) => {
            const status = getStatus(mov.quantity, mov.minimum_stock ?? 0);
            const producto = productos.find((p) => p.id === mov.product_id);
            return (
              <TableRow key={mov.id} className="text-base font-medium text-dark dark:text-white">
                <TableCell>{producto?.name || "-"}</TableCell>
                <TableCell>{producto?.category?.name || "-"}</TableCell>
                <TableCell>{mov.quantity}</TableCell>
                <TableCell>{mov.unit_cost ? `$${mov.unit_cost}` : "-"}</TableCell>
                <TableCell>{mov.unit_cost*mov.quantity? `$${mov.unit_cost*mov.quantity}` : "-"}</TableCell>
                <TableCell>{mov.warehouse?.name || "-"}</TableCell>
                <TableCell>
                  <div
                    className={`max-w-fit rounded-full px-3.5 py-1 text-sm font-medium cursor-pointer ${status.color}`}
                    onClick={() => producto && handleVerHistorial(producto)}
                  >
                    Ver historial
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`max-w-fit rounded-full px-3.5 py-1 text-sm font-medium ${status.color}`}>
                    {status.label}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {/* TODO: Add modals for edit/details if needed, matching other modules */}
    </div>
  );
}