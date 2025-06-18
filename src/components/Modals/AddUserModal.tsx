"use client";

import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/constants";
import Toast from "@/components/ui/Toast";

interface AddUserModalProps {
  triggerButtonClassName?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (user?: any) => void;
}

const initialState = {
  first_name: "",
  last_name: "",
  dni: "",
  phone: "",
  email: "",
  position: "",
  hire_date: "", // string vacía para nulo
  can_manage_inventory: false,
  active: false,
  password: "",
};

const AddUserModal: React.FC<AddUserModalProps> = ({ triggerButtonClassName, isOpen: isOpenProp, onClose, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ ...initialState });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const headerHiddenRef = useRef(false);

  const openModal = () => {
    setForm({ ...initialState });
    setError(null);
    setSuccess(null);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const requiredFields = [
      "first_name",
      "last_name",
      "dni",
      "phone",
      "email",
      "position",
      "password",
    ];
    for (const field of requiredFields) {
      if (!form[field as keyof typeof form]) {
        return `El campo ${field.replace("_", " ")} es requerido.`;
      }
    }
    // Restricción de contraseña mínima
    if (form.password && form.password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validationError = validate();
    if (validationError) {
      setToast({ message: validationError, type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        hire_date: form.hire_date ? form.hire_date : null,
      };
      const res = await fetch(`${API_BASE_URL}/api/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        setToast({ message: "Usuario registrado exitosamente", type: 'success' });
        setForm({ ...initialState });
        if (onSuccess) onSuccess(result.data || payload);
        setTimeout(() => {
          setIsOpen(false);
        }, 1200);
      } else {
        setToast({ message: result.message || "Error al registrar usuario", type: 'error' });
      }
    } catch (err) {
      setToast({ message: "Error de conexión con el servidor", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Nuevo: ocultar header al abrir/cerrar modal
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

  // Sincroniza estado abierto/cerrado si se usa como controlado
  useEffect(() => {
    if (typeof isOpenProp === 'boolean') setIsOpen(isOpenProp);
  }, [isOpenProp]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="max-w-50 px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg self-end"
      >
        Añadir Usuario +
      </button>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md" 
               style={{maxHeight: "-webkit-fill-available", overflowY: "auto",}}>
            {toast && (
              <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
            <h2 className="text-xl font-bold mb-4">Añadir Usuario</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el nombre"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Apellido</label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el apellido"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">DNI</label>
                <input
                  type="text"
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el DNI"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el teléfono"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el correo electrónico"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cargo</label>
                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el cargo"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Contratación</label>
                <input
                  type="date"
                  name="hire_date"
                  value={form.hire_date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mb-4 flex items-center gap-4">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    name="can_manage_inventory"
                    checked={form.can_manage_inventory}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Puede gestionar inventario
                </label>
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Activo
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese la contraseña"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg"
                  disabled={loading}
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

export default AddUserModal;