"use client";

import UserDetailsModal from "@/components/Modals/UserDetailsModal";
import EditUserModal from "@/components/Modals/EditUserModal";
import Toast from "@/components/ui/Toast";
import { useEffect, useState, useRef } from "react";
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from "@/lib/constants";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function UsuariosTabla() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const cacheRef = useRef<{ [key: string]: any[] }>({});

  // Refactor: fetchData como función reutilizable
  const fetchData = async (pageIndex = 0, pageSize = 10) => {
    const cacheKey = `${pageIndex}_${pageSize}`;
    if (cacheRef.current[cacheKey]) {
      setData(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/paginated?per_page=${pageSize}&page=${pageIndex + 1}`);
      const json = await res.json();
      const usersData = Array.isArray(json.data)
        ? json.data
        : Array.isArray(json.data?.data)
          ? json.data.data
          : [];
      cacheRef.current[cacheKey] = usersData;
      setData(usersData);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  useEffect(() => {
    // Obtener el usuario actual del localStorage
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    setCurrentUserId(user?.id ?? null);
  }, []);

  // Handler para refrescar datos tras edición
  const handleEditSuccess = () => {
    fetchData(page, rowsPerPage);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setShowEdit(true);
  };

  const handleDetails = (user: any) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const exportToCSV = () => {
    const headers = ["Usuario", "Correo", "Cargo", "Teléfono", "Activo"];
    const rows = data.map(u => [
      u.user?.name || "", u.email || "", u.position || "", u.phone || "", u.active ? "Sí" : "No"
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usuarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = [[ "Correo", "Cargo", "Teléfono", "Activo"]];
    const rows = data.map(u => [
      u.email || "", u.position || "", u.phone || "", u.active ? "Sí" : "No"
    ]);
    autoTable(doc, { head: headers, body: rows });
    doc.save("usuarios.pdf");
  };

  const columns = [

    { accessorKey: "email", header: "Correo" },
    { accessorKey: "position", header: "Cargo" },
    { accessorKey: "phone", header: "Teléfono" },
    {
      accessorKey: "active",
      header: "Activo",
      Cell: ({ cell }: any) => (cell.getValue() ? "Sí" : "No"),
    },
  ];

  // Eliminar empleado
  const handleDelete = async (user: any) => {
    if (!user?.id) return;
    if (!window.confirm('¿Está seguro de eliminar este empleado?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${user.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Eliminar el usuario del estado local inmediatamente
        setData((prev) => prev.filter((u) => u.id !== user.id));
        setToast({ message: 'Empleado eliminado correctamente', type: 'success' });
        // Opcional: limpiar caché para que la próxima paginación/fetch sea correcta
        cacheRef.current = {};
      } else {
        setToast({ message: 'Error al eliminar el empleado', type: 'error' });
      }
    } catch (e) {
      setToast({ message: 'Error de conexión al eliminar el empleado', type: 'error' });
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex justify-end gap-2 mb-2">
        <button onClick={exportToPDF} className="bg-primary text-white px-3 py-1 rounded">Descargar PDF</button>
        <button onClick={exportToCSV} className="bg-primary text-white px-3 py-1 rounded">Descargar CSV</button>
      </div>
      <MaterialReactTable
        columns={columns}
        data={data}
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
           
            {/* Bloquea el borrado del usuario actual comparando con row.original.id */}
            {row.original.id !== currentUserId && (
              <IconButton color="error" size="small" onClick={() => handleDelete(row.original)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
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

      {selectedUser && showDetails && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => { setShowDetails(false); setSelectedUser(null); }}
        />
      )}
      {selectedUser && showEdit && (
        <EditUserModal
          user={selectedUser}
          onClose={() => { setShowEdit(false); setSelectedUser(null); }}
          onSuccess={handleEditSuccess}
        />
      )}
      {/* Eliminar el modal AddUserModal de aquí, ya que el correcto está en TablesPage */}
    </Box>
  );
}