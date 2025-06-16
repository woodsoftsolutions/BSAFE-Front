"use client";

import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

interface AddInventarioModalProps {
  triggerButtonClassName?: string;
  onSuccess?: () => void;
}

const AddInventarioModal: React.FC<AddInventarioModalProps> = ({ triggerButtonClassName, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const headerHiddenRef = useRef(false);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState({
    product_id: "",
    warehouse_id: "",
    employee_id: "",
    quantity: "",
    unit_cost: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Fetch options when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      fetch(`${API_BASE_URL}/api/products`)
        .then((res) => res.json())
        .then((data) => setProducts(Array.isArray(data) ? data : (data.data || [])));
      fetch(`${API_BASE_URL}/api/warehouses`)
        .then((res) => res.json())
        .then((data) => setWarehouses(Array.isArray(data) ? data : (data.data || [])));
      fetch(`${API_BASE_URL}/api/employees`)
        .then((res) => res.json())
        .then((data) => setEmployees(Array.isArray(data) ? data : (data.data || [])));
    }
  }, [isOpen]);

  // Hide header logic (unchanged)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "product_id" && value === "new") {
      closeModal();
      router.push("/productos");
      return;
    }
    if (name === "employee_id" && value === "new") {
      closeModal();
      router.push("/usuarios");
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory-movements`, {
        method: "POST",
        headers: {'Accept': 'application/json', "Content-Type": "application/json" },
        body: JSON.stringify({
          movement_type: "entry",
          product_id: form.product_id,
          warehouse_id: form.warehouse_id,
          employee_id: form.employee_id,
          quantity: Number(form.quantity),
          minimum_stock: 0,
          unit_cost: Number(form.unit_cost),
        }),
      });
      if (res.ok) {
        setForm({ product_id: "", warehouse_id: "", employee_id: "", quantity: "", unit_cost: "" });
        closeModal();
        if (onSuccess) onSuccess();
      } else {
        const data = await res.json();
        setError(data.message || "Error al guardar el movimiento de inventario");
      }
    } catch (err: any) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className={triggerButtonClassName || "px-4 py-2 bg-[#99DFD8] hover:bg-[#24726b] text-white rounded-lg"}
      >
        Añadir Inventario +
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Añadir Inventario</h2>
            <form onSubmit={handleSubmit}>
              {error && <div className="mb-2 text-red-500">{error}</div>}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Producto</label>
                <select
                  name="product_id"
                  value={form.product_id}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccione un producto</option>
                  <option value="new">+ Nuevo producto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Almacén</label>
                <select
                  name="warehouse_id"
                  value={form.warehouse_id}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccione un almacén</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empleado</label>
                <select
                  name="employee_id"
                  value={form.employee_id}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccione un empleado</option>
                  <option value="new">+ Nuevo empleado</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese la cantidad"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio</label>
                <input
                  type="number"
                  name="unit_cost"
                  value={form.unit_cost}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el precio"
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

export default AddInventarioModal;