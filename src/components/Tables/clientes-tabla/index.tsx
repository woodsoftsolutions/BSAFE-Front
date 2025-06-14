"use client";

import { useEffect, useState } from "react";
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import ClientDetailsModal from "@/components/Modals/ClientDetailsModal";
import EditClientModal from "@/components/Modals/EditClientModal";
import AddClientModal from "@/components/Modals/AddClientModal";
import { API_BASE_URL } from "@/lib/constants";

export default function ClientesTabla() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchClientes = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/customers`);
    const data = await res.json();
    setClientes(Array.isArray(data) ? data : data.data || data.results || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleEdit = (client: any) => {
    setSelectedClient(client);
    setShowEdit(true);
  };

  const handleDetails = (client: any) => {
    setSelectedClient(client);
    setShowDetails(true);
  };

  const handleSaveEdit = () => {
    setShowEdit(false);
    fetchClientes();
  };

  const handleAddClient = () => {
    fetchClientes();
    setShowAddModal(false);
  };

  useEffect(() => {
    const header = document.querySelector("header");
    if (showDetails || showEdit || showAddModal) {
      if (header) header.style.display = "none";
    } else {
      if (header) header.style.display = "";
    }
    return () => {
      if (header) header.style.display = "";
    };
  }, [showDetails, showEdit, showAddModal]);

  const columns = [
    {
      accessorKey: "name",
      header: "Cliente",
      Cell: ({ cell, row }: any) => (
        <Typography
          onClick={() => handleDetails(row.original)}
          sx={{ cursor: "pointer", fontWeight: 500 }}
        >
          {cell.getValue()}
        </Typography>
      ),
    },
    { accessorKey: "contact_person", header: "Contacto" },
    { accessorKey: "phone", header: "Teléfono" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "address", header: "Dirección" },
    { accessorKey: "tax_id", header: "RIF" },
    { accessorKey: "customer_type", header: "Tipo" },
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
        data={clientes}
        state={{ isLoading: loading }}
        enableRowActions
        positionActionsColumn: 'last'
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

      {selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
      {selectedClient && (
        <EditClientModal
          client={selectedClient}
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onSave={handleSaveEdit}
        />
      )}
      {showAddModal && (
        <AddClientModal
          onSuccess={handleAddClient}
          triggerButtonClassName="hidden"
        />
      )}
    </Box>
  );
}
