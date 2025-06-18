"use client";
import { useEffect, useState, useRef } from "react";
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from "@/lib/constants";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AddProductModal from "@/components/Modals/AddProductModal";

export default function ProductosTabla() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const cacheRef = useRef<{ [key: string]: any[] }>({});

  const fetchProductos = async (pageIndex = 0, pageSize = 10) => {
    const cacheKey = `${pageIndex}_${pageSize}`;
    if (cacheRef.current[cacheKey]) {
      setProductos(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/products/paginated?per_page=${pageSize}&page=${pageIndex + 1}`);
    const data = await res.json();
    const productosData = Array.isArray(data.data) ? data.data : data.data?.data || [];
    cacheRef.current[cacheKey] = productosData;
    setProductos(productosData);
    setLoading(false);
  };

  useEffect(() => {
    fetchProductos(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setShowEdit(true);
  };
  const handleDetails = (product: any) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };
  const handleSaveEdit = (updated: any) => {
    setShowEdit(false);
    fetchProductos();
  };
  const handleAddProduct = () => {
    fetchProductos();
    setShowAddModal(false);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProductos();
      } else {
        alert("Error al eliminar el producto");
      }
    } catch (err) {
      alert("Error de conexión al eliminar");
    }
  };

  const exportToCSV = () => {
    const headers = ["Código", "Nombre", "Descripción", "Categoría", "Unidad", "Activo"];
    const rows = productos.map(p => [
      p.code, p.name, p.description, p.category?.name, p.unit?.name, p.active ? "Sí" : "No"
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "productos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = [["Código", "Nombre", "Descripción", "Categoría", "Unidad", "Activo"]];
    const rows = productos.map(p => [
      p.code, p.name, p.description, p.category?.name, p.unit?.name, p.active ? "Sí" : "No"
    ]);
    autoTable(doc, { head: headers, body: rows });
    doc.save("productos.pdf");
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
    { accessorKey: "code", header: "Código" },
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "description", header: "Descripción" },
    { accessorKey: "category.name", header: "Categoría", Cell: ({ row }: any) => row.original.category?.name || "-" },
    { accessorKey: "unit.name", header: "Unidad", Cell: ({ row }: any) => row.original.unit?.name || "-" },
    {
      accessorKey: "active",
      header: "Activo",
      Cell: ({ cell }: any) => (cell.getValue() ? "Sí" : "No"),
    },
  ];

  if (loading) return <div className="p-4">Cargando productos...</div>;

  return (
    <Box sx={{ mt: 2 }} className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="hidden">
        <AddProductModal onSuccess={fetchProductos} triggerButtonClassName="max-w-45 px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-dark" />
      </div>
      <div className="flex justify-end gap-2 mb-2">
        <button onClick={exportToPDF} className="bg-primary text-white px-3 py-1 rounded">Descargar PDF</button>
        <button onClick={exportToCSV} className="bg-primary text-white px-3 py-1 rounded">Descargar CSV</button>
      </div>
      <MaterialReactTable
        columns={columns}
        data={productos}
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
