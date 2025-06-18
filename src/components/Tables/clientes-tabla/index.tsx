"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const cacheRef = useRef<{ [key: string]: any[] }>({});

  const fetchClientes = async (pageIndex = 0, pageSize = 10) => {
    const cacheKey = `${pageIndex}_${pageSize}`;
    if (cacheRef.current[cacheKey]) {
      setClientes(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/customers/paginated?per_page=${pageSize}&page=${pageIndex + 1}`);
    const data = await res.json();
    const clientesData = Array.isArray(data.data) ? data.data : data.data?.data || [];
    cacheRef.current[cacheKey] = clientesData;
    setClientes(clientesData);
    setLoading(false);
  };

  useEffect(() => {
    fetchClientes(page, rowsPerPage);
  }, [page, rowsPerPage]);

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
    fetchClientes(page, rowsPerPage);
  };

  // Recibe onSuccess del modal para refrescar la tabla inmediatamente
  const handleAddClient = () => {
    cacheRef.current = {};
    fetchClientes(page, rowsPerPage);
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

  const exportToCSV = () => {
    const headers = [
      "Cliente", "Contacto", "Teléfono", "Email", "Dirección", "RIF", "Tipo", "Activo"
    ];
    const rows = clientes.map(c => [
      c.name, c.contact_person, c.phone, c.email, c.address, c.tax_id, c.customer_type, c.active ? "Sí" : "No"
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clientes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = [[
      "Cliente", "Contacto", "Teléfono", "Email", "Dirección", "RIF", "Tipo", "Activo"
    ]];
    const rows = clientes.map(c => [
      c.name, c.contact_person, c.phone, c.email, c.address, c.tax_id, c.customer_type, c.active ? "Sí" : "No"
    ]);
    autoTable(doc, { head: headers, body: rows });
    doc.save("clientes.pdf");
  };

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
      <div className="flex justify-end gap-2 mb-2">
        <button onClick={exportToPDF} className="bg-primary text-white px-3 py-1 rounded">Descargar PDF</button>
        <button onClick={exportToCSV} className="bg-primary text-white px-3 py-1 rounded">Descargar CSV</button>
      </div>
      <MaterialReactTable
        columns={columns}
        data={clientes}
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
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          triggerButtonClassName="max-w-45 px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg self-end"
          onSuccess={handleAddClient}
        />
      )}
    </Box>
  );
}
