"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashIcon, PencilSquareIcon } from "@/assets/icons";
import { EyeIcon } from "@/assets/icons";
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
    // Ajuste para estructura { success, data: [...] }
    setClientes(Array.isArray(data) ? data : (data.data || data.results || []));
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
  const handleSaveEdit = (updated: any) => {
    setShowEdit(false);
    fetchClientes();
  };

  // Refrescar tabla tras añadir cliente
  const handleAddClient = () => {
    fetchClientes();
    setShowAddModal(false);
  };

  // Ocultar header al abrir modales
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

  if (loading) return <div className="p-4">Cargando clientes...</div>;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">Cliente</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>RIF</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Activo</TableHead>
            <TableHead className="text-right xl:pr-7.5">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id} className="text-base font-medium text-dark dark:text-white">
              <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5 cursor-pointer" onClick={() => handleDetails(cliente)}>
                <div>{cliente.name}</div>
              </TableCell>
              <TableCell>{cliente.contact_person}</TableCell>
              <TableCell>{cliente.phone}</TableCell>
              <TableCell>{cliente.email}</TableCell>
              <TableCell>{cliente.address}</TableCell>
              <TableCell>{cliente.tax_id}</TableCell>
              <TableCell>{cliente.customer_type}</TableCell>
              <TableCell>{cliente.active ? "Sí" : "No"}</TableCell>
              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button className="hover:text-primary" onClick={() => handleDetails(cliente)}>
                    <span className="sr-only">Ver</span>
                    <EyeIcon />
                  </button>
                  <button className="hover:text-primary" onClick={() => handleEdit(cliente)}>
                    <span className="sr-only">Editar</span>
                    <PencilSquareIcon />
                  </button>
                  <button className="hover:text-red-500">
                    <span className="sr-only">Eliminar</span>
                    <TrashIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedClient && (
        <ClientDetailsModal client={selectedClient} isOpen={showDetails} onClose={() => setShowDetails(false)} />
      )}
      {selectedClient && (
        <EditClientModal client={selectedClient} isOpen={showEdit} onClose={() => setShowEdit(false)} onSave={handleSaveEdit} />
      )}
      {showAddModal && (
        <AddClientModal
          onSuccess={handleAddClient}
          triggerButtonClassName="hidden" // no se muestra el botón dentro del modal
        />
      )}
    </div>
  );
}
