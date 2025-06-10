"use client";
import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/constants";

interface EditClientModalProps {
  client: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: any) => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ client, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({ ...client });
  const [loading, setLoading] = useState(false);
  const headerHiddenRef = useRef(false);

  useEffect(() => {
    setForm({ ...client });
  }, [client]);

  // Ocultar header al abrir el modal
  useEffect(() => {
    const header = document.querySelector("header");
    if (isOpen) {
      if (header && !headerHiddenRef.current) {
        header.style.display = "none";
        headerHiddenRef.current = true;
      }
    } else {
      if (header && headerHiddenRef.current) {
        header.style.display = "";
        headerHiddenRef.current = false;
      }
    }
    return () => {
      if (header && headerHiddenRef.current) {
        header.style.display = "";
        headerHiddenRef.current = false;
      }
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev: any) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customers/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        onSave(updated);
        setTimeout(() => {
          onClose();
        }, 100); // Asegura que onSave refresque la tabla antes de cerrar
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese el nombre del cliente"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contacto</label>
            <input
              name="contact_person"
              value={form.contact_person || ""}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Persona de contacto"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese el teléfono"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese el correo electrónico"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dirección</label>
            <input
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese la dirección"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">RUC</label>
            <input
              name="tax_id"
              value={form.tax_id || ""}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese el RUC"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de cliente</label>
            <select
              name="customer_type"
              value={form.customer_type || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
            >
              <option value="wholesaler">Mayorista</option>
              <option value="retail">Minorista</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notas</label>
            <textarea
              name="notes"
              value={form.notes || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Notas del cliente"
            />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <input
              name="active"
              type="checkbox"
              checked={!!form.active}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Activo</label>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#99DFD8] hover:bg-[#24726b] text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;
