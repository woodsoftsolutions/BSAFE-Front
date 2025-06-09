"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashIcon, PencilSquareIcon } from "@/assets/icons";
import { EyeIcon } from "@/assets/icons";
import AddProductModal from "@/components/Modals/AddProductModal";

export default function ProductosTabla() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchProductos = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8000/api/products");
    const data = await res.json();
    setProductos(Array.isArray(data) ? data : (data.data || data.results || []));
    setLoading(false);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

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
      const res = await fetch(`http://localhost:8000/api/delete/${id}`, {
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

  if (loading) return <div className="p-4">Cargando productos...</div>;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="hidden">
        <AddProductModal onSuccess={fetchProductos} triggerButtonClassName="max-w-45 px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-dark" />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Activo</TableHead>
            <TableHead className="text-right xl:pr-7.5">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.id} className="text-base font-medium text-dark dark:text-white">
              <TableCell>{producto.code}</TableCell>
              <TableCell>{producto.name}</TableCell>
              <TableCell>{producto.description}</TableCell>
              <TableCell>{producto.category?.name}</TableCell>
              <TableCell>{producto.unit?.name}</TableCell>
              <TableCell>{producto.active ? "Sí" : "No"}</TableCell>
              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button className="hover:text-primary" onClick={() => handleDetails(producto)}>
                    <span className="sr-only">Ver</span>
                    <EyeIcon />
                  </button>
                  <button className="hover:text-primary" onClick={() => handleEdit(producto)}>
                    <span className="sr-only">Editar</span>
                    <PencilSquareIcon />
                  </button>
                  <button className="hover:text-red-500" onClick={() => handleDelete(producto.id)}>
                    <span className="sr-only">Eliminar</span>
                    <TrashIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/*
      {selectedProduct && (
        <ProductDetailsModal product={selectedProduct} isOpen={showDetails} onClose={() => setShowDetails(false)} />
      )}
      {selectedProduct && (
        <EditProductModal product={selectedProduct} isOpen={showEdit} onClose={() => setShowEdit(false)} onSave={handleSaveEdit} />
      )}
      {showAddModal && (
        <AddProductModal onSuccess={handleAddProduct} triggerButtonClassName="hidden" />
      )}
      */}
    </div>
  );
}
