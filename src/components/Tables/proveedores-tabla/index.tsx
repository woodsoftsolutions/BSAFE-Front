import { useEffect, useState, useRef } from "react";
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from "@/lib/constants";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  const exportToCSV = () => {
    const headers = ["Proveedor", "Contacto", "Teléfono", "Email", "Dirección", "RIF", "Notas", "Activo"];
    const rows = proveedores.map(p => [
      p.name, p.contact_person, p.phone, p.email, p.address, p.tax_id, p.notes, p.active ? "Sí" : "No"
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "proveedores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = [["Proveedor", "Contacto", "Teléfono", "Email", "Dirección", "RIF", "Notas", "Activo"]];
    const rows = proveedores.map(p => [
      p.name, p.contact_person, p.phone, p.email, p.address, p.tax_id, p.notes, p.active ? "Sí" : "No"
    ]);
    autoTable(doc, { head: headers, body: rows });
    doc.save("proveedores.pdf");
  };

  const columns = [
    { accessorKey: "name", header: "Proveedor" },
    { accessorKey: "contact_person", header: "Contacto" },
    { accessorKey: "phone", header: "Teléfono" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "address", header: "Dirección" },
    { accessorKey: "tax_id", header: "RIF" },
    { accessorKey: "notes", header: "Notas" },
    {
      accessorKey: "active",
      header: "Activo",
      Cell: ({ cell }: any) => (cell.getValue() ? "Sí" : "No"),
    },
  ];

  if (loading) return <div className="p-4">Cargando proveedores...</div>;

  return (
    <Box sx={{ mt: 2 }} className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex justify-end gap-2 mb-2">
        <button onClick={exportToPDF} className="bg-primary text-white px-3 py-1 rounded">Descargar PDF</button>
        <button onClick={exportToCSV} className="bg-primary text-white px-3 py-1 rounded">Descargar CSV</button>
      </div>
      <MaterialReactTable
        columns={columns}
        data={proveedores}
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
            <IconButton onClick={() => handleDetails(row.original)} size="small">
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={() => handleEdit(row.original)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton color="error" onClick={() => handleDelete(row.original.id)} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
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
