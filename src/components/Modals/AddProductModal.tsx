"use client";

import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/constants";
import dynamic from "next/dynamic";

const BarcodeScannerComponent = dynamic(() => import("react-qr-barcode-scanner"), { ssr: false });

interface AddProductModalProps {
  triggerButtonClassName?: string;
  onSuccess?: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ triggerButtonClassName, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const headerHiddenRef = useRef(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [units, setUnits] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    code: "",
    name: "",
    brand: "",
    model: "",
    description: "",
    category_id: "",
    unit_id: "",
    current_stock: "",
    minimum_stock: "",
    active: true,
  });
  const [showScanner, setShowScanner] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

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

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/api/categories`)
        .then((res) => res.json())
        .then((data) => {
          const cats = data?.data?.categorias || [];
          setCategories(cats);
        });
      fetch(`${API_BASE_URL}/api/units`)
        .then((res) => res.json())
        .then((data) => {
          const unitsArr = data?.data || [];
          setUnits(unitsArr);
        });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBarcodeScan = (err: any, result: any) => {
    if (result?.text) {
      setForm((prev) => ({ ...prev, code: result.text }));
      setShowScanner(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          brand: form.brand,
          model: form.model,
          description: form.description,
          category_id: form.category_id,
          unit_id: form.unit_id,
          current_stock: 0,
          minimum_stock: 0,
          active: form.active,
        }),
      });
      if (res.ok) {
        // Opcional: limpiar formulario, cerrar modal, refrescar tabla, etc.
        closeModal();
        if (onSuccess) onSuccess(); // <-- Llama a onSuccess después de guardar
      } else {
        alert("Error al guardar el producto");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className={triggerButtonClassName || "px-4 py-2 bg-[#99DFD8] hover:bg-[#24726b] text-white rounded-lg"}
      >
        Añadir Producto +
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Añadir Producto</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Código
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                    placeholder="Código del producto"
                    required
                  />
                  <button type="button" onClick={() => setShowScanner(true)} className="px-2 py-1 bg-primary text-white rounded">Escanear</button>
                </div>
                {showScanner && (
                  <div className="mt-2">
                    <BarcodeScannerComponent
                      width={300}
                      height={200}
                      onUpdate={handleBarcodeScan}
                    />
                    <button type="button" onClick={() => setShowScanner(false)} className="mt-2 px-2 py-1 bg-gray-300 rounded">Cerrar escáner</button>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre del producto"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Marca
                </label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Marca del producto"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Modelo
                </label>
                <input
                  type="text"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Modelo del producto"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descripción
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese la descripción del producto"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Categoría
                </label>
                <div className="flex gap-2">
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="new">+ Añadir categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {form.category_id === "new" && (
                    <button
                      type="button"
                      onClick={() => { setIsOpen(false); window.location.href = "/settings"; }}
                      className="px-2 py-1 bg-primary text-white rounded"
                    >
                      Crear categoría
                    </button>
                  )}
                </div>
              </div>
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="current_stock"
                  value={form.current_stock}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese la cantidad del producto"
                />
              </div> */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Unidad
                </label>
                <div className="flex gap-2">
                  <select
                    name="unit_id"
                    value={form.unit_id}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Seleccione una unidad</option>
                    <option value="new">+ Añadir unidad</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>{unit.name}</option>
                    ))}
                  </select>
                  {form.unit_id === "new" && (
                    <button
                      type="button"
                      onClick={() => { setIsOpen(false); window.location.href = "/settings"; }}
                      className="px-2 py-1 bg-primary text-white rounded"
                    >
                      Crear unidad
                    </button>
                  )}
                </div>
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
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProductModal;