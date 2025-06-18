"use client";

import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/constants";
import Toast from "@/components/ui/Toast";

interface AddClientModalProps {
  triggerButtonClassName?: string;
   isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ triggerButtonClassName, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    tax_id: "",
    customer_type: "wholesaler",
    notes: "",
    active: true

  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const headerHiddenRef = useRef(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target.type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setToast({ message: "Cliente registrado exitosamente", type: 'success' });
        setForm({
          name: "",
          contact_person: "",
          phone: "",
          email: "",
          address: "",
          tax_id: "",
          customer_type: "wholesaler",
          notes: "",
          active: true,
        });
        setTimeout(() => {
          closeModal();
          if (onSuccess) onSuccess();
        }, 1200);
      } else {
        setToast({ message: "Error al registrar cliente", type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
          className="max-w-45 px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg self-end"
      >
        Añadir Cliente +
      </button>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md" style={{maxHeight: "-webkit-fill-available", overflowY: "auto", }}>
            {toast && (
              <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
            <h2 className="text-xl font-bold mb-4">Añadir Cliente</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el nombre del cliente"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contacto
                </label>
                <input
                  name="contact_person"
                  value={form.contact_person}
                  onChange={handleChange}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Persona de contacto"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Teléfono
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el teléfono"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el correo electrónico"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dirección
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese la dirección"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  RUC
                </label>
                <input
                  name="tax_id"
                  value={form.tax_id}
                  onChange={handleChange}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el RUC"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tipo de cliente
                </label>
                <select
                  name="customer_type"
                  value={form.customer_type}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                >
                  <option value="regular">Regular</option>
                  <option value="wholesaler">Minorista</option>
                  <option value="government">Gubernamental</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notas
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Notas del cliente"
                />
              </div>
              <div className="mb-4 flex items-center gap-2">
                <input
                  name="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Activo</label>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
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
      )}
    </>
  );
};

export default AddClientModal;