"use client";

import UserDetailsModal from "@/components/Modals/UserDetailsModal";
import EditUserModal from "@/components/Modals/EditUserModal";
import AddUserModal from "@/components/Modals/AddUserModal";

import { useEffect, useState } from "react";
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from "@/lib/constants";

export function UsuariosTabla() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Refactor: fetchData como función reutilizable
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees`);
      const json = await res.json();
      setData(json.data || []);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler para refrescar datos tras edición
  const handleEditSuccess = () => {
    fetchData();
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
    fetchData();
    setShowAddModal(false);
  };

  const columns = [
    {
      accessorKey: "name",
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
    { accessorKey: "cargo", header: "Cargo" },
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
        state={{ isLoading: loading }}
        enableFullScreenToggle={false}
        enableRowActions
        positionActionsColumn="last"
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
            backgroundColor: "#fff",
          },
        }}
        muiTableContainerProps={{
          sx: {
            maxHeight: "600px",
          },
        }}
        muiTableHeadCellProps={{
          sx: { fontWeight: "bold", backgroundColor: "#f5f5f5" },
        }}
        muiTableBodyCellProps={{
          sx: { fontSize: "0.95rem" },
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
          onSave={handleSaveEdit}
        />
      )}
      {showAddModal && (
        <AddUserModal
          onSuccess={handleAddUser}
          triggerButtonClassName="hidden"
        />
      )}
    </Box>
  );
}