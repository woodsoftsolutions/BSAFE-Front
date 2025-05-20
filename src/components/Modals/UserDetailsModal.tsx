import React, { useState } from "react";

interface UserDetailsModalProps {
  user: any;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Detalles del Usuario</h2>
        <div className="space-y-3 mb-6">
          <div><span className="font-semibold">Nombre:</span> {user.user?.name || "-"}</div>
          <div><span className="font-semibold">Correo:</span> {user.user?.email || "-"}</div>
          <div><span className="font-semibold">Cargo:</span> {user.position || "-"}</div>
          <div><span className="font-semibold">Teléfono:</span> {user.phone || "-"}</div>
          <div><span className="font-semibold">DNI:</span> {user.dni || "-"}</div>
          <div><span className="font-semibold">Fecha de Contratación:</span> {user.hire_date || "-"}</div>
          <div><span className="font-semibold">Puede gestionar inventario:</span> {user.can_manage_inventory ? "Sí" : "No"}</div>
          <div><span className="font-semibold">Activo:</span> {user.active ? "Sí" : "No"}</div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
