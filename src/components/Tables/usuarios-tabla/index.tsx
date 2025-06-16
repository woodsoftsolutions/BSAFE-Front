"use client";

import UserDetailsModal from "@/components/Modals/UserDetailsModal";
import EditUserModal from "@/components/Modals/EditUserModal";
import AddUserModal from "@/components/Modals/AddUserModal";
import { useEffect, useState, useRef } from "react";
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from "@/lib/constants";

export function UsuariosTabla() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleAddUser = () => {
    fetchData(page, rowsPerPage);
    setShowAddModal(false);
  };

  const columns = [
    {
      accessorKey: "user.name",
      header: "Usuario",
      Cell: ({ cell, row }: any) => (
        <Typography
          onClick={() => handleDetails(row.original)}
          sx={{ cursor: "pointer", fontWeight: 500 }}
        >
          {cell.getValue()}
        </Typography>
      ),
    },
    { accessorKey: "email", header: "Correo" },
    { accessorKey: "position", header: "Cargo" },
    { accessorKey: "phone", header: "Teléfono" },
    {
      accessorKey: "active",
      header: "Activo",
      Cell: ({ cell }: any) => (cell.getValue() ? "Sí" : "No"),
    },
  ];



  return (
    <Box sx={{ mt: 2 }}>
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
            <IconButton color="error" size="small">
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

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          // isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          // isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </Box>
  );
}