"use client";
import React from "react";

interface ClientDetailsModalProps {
  client: any;
  isOpen: boolean;
  onClose: () => void;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ client, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Detalles del Cliente</h2>
        <div className="mb-2"><b>Nombre:</b> {client.name}</div>
        <div className="mb-2"><b>Contacto:</b> {client.contact_person}</div>
        <div className="mb-2"><b>Teléfono:</b> {client.phone}</div>
        <div className="mb-2"><b>Email:</b> {client.email}</div>
        <div className="mb-2"><b>Dirección:</b> {client.address}</div>
        <div className="mb-2"><b>RUC:</b> {client.tax_id}</div>
        <div className="mb-2"><b>Tipo:</b> {client.customer_type}</div>
        <div className="mb-2"><b>Notas:</b> {client.notes}</div>
        <div className="mb-2"><b>Activo:</b> {client.active ? "Sí" : "No"}</div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-[#99DFD8] text-white rounded-lg">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;
