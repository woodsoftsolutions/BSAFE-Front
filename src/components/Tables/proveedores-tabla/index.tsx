import { useEffect, useState, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashIcon, PencilSquareIcon } from "@/assets/icons";
import { EyeIcon } from "@/assets/icons";
import AddProveedoresModal from "@/components/Modals/AddProveedoresModal";
import { API_BASE_URL } from "@/lib/constants";

export default function ProveedoresTabla() {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProveedor, setSelectedProveedor] = useState<any | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const cacheRef = useRef<{ [key: string]: any[] }>({});

  const fetchProveedores = async (pageIndex = 0, pageSize = 10) => {
    const cacheKey = `${pageIndex}_${pageSize}`;
    if (cacheRef.current[cacheKey]) {
      setProveedores(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/suppliers/paginated?per_page=${pageSize}&page=${pageIndex + 1}`);
    const data = await res.json();
    const proveedoresData = Array.isArray(data.data) ? data.data : data.data?.data || [];
    cacheRef.current[cacheKey] = proveedoresData;
    setProveedores(proveedoresData);
    setLoading(false);
  };

  useEffect(() => {
    fetchProveedores(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleEdit = (proveedor: any) => {
    setSelectedProveedor(proveedor);
    setShowEdit(true);
  };
  const handleDetails = (proveedor: any) => {
    setSelectedProveedor(proveedor);
    setShowDetails(true);
  };
  const handleSaveEdit = () => {
    setShowEdit(false);
    fetchProveedores(page, rowsPerPage);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProveedores(page, rowsPerPage);
      } else {
        alert("Error al eliminar el proveedor");
      }
    } catch (err) {
      alert("Error de conexión al eliminar");
    }
  };

  if (loading) return <div className="p-4">Cargando proveedores...</div>;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* <div className="flex justify-end p-4">
        <AddProveedoresModal onSuccess={fetchProveedores} />
      </div> */}
      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">Proveedor</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>RIF</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead>Activo</TableHead>
            <TableHead className="text-right xl:pr-7.5">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proveedores.map((proveedor) => (
            <TableRow key={proveedor.id} className="text-base font-medium text-dark dark:text-white">
              <TableCell>{proveedor.name}</TableCell>
              <TableCell>{proveedor.contact_person}</TableCell>
              <TableCell>{proveedor.phone}</TableCell>
              <TableCell>{proveedor.email}</TableCell>
              <TableCell>{proveedor.address}</TableCell>
              <TableCell>{proveedor.tax_id}</TableCell>
              <TableCell>{proveedor.notes}</TableCell>
              <TableCell>{proveedor.active ? "Sí" : "No"}</TableCell>
              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button className="hover:text-primary" onClick={() => handleDetails(proveedor)}>
                    <span className="sr-only">Ver</span>
                    <EyeIcon />
                  </button>
                  <button className="hover:text-primary" onClick={() => handleEdit(proveedor)}>
                    <span className="sr-only">Editar</span>
                    <PencilSquareIcon />
                  </button>
                  <button className="hover:text-red-500" onClick={() => handleDelete(proveedor.id)}>
                    <span className="sr-only">Eliminar</span>
                    <TrashIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-4">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
        <span className="mx-2">Página {page + 1}</span>
        <button onClick={() => setPage(page + 1)}>Siguiente</button>
      </div>
      {/*
      {selectedProveedor && (
        <EditProveedorModal proveedor={selectedProveedor} isOpen={showEdit} onClose={() => setShowEdit(false)} onSave={handleSaveEdit} />
      )}
      */}
    </div>
  );
}
