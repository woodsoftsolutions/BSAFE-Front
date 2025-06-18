"use client";

import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Toast from "@/components/ui/Toast";

const BarcodeScannerComponent = dynamic(() => import("react-qr-barcode-scanner"), { ssr: false });

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
  const [units, setUnits] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [form, setForm] = useState({
    product_id: "",
    warehouse_id: "",
    employee_id: "",
    category_id: "",
    supplier_id: "",
    quantity: "",
    unit_cost: "",
    code: "",
    unit_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
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
      fetch(`${API_BASE_URL}/api/units`)
        .then((res) => res.json())
        .then((data) => setUnits(Array.isArray(data) ? data : (data.data || [])));
      fetch(`${API_BASE_URL}/api/categories`)
        .then((res) => res.json())
        .then((data) => {
          // Ajuste robusto para estructura { data: { categorias: [...] } }
          if (data && data.data && Array.isArray(data.data.categorias)) {
            setCategories(data.data.categorias);
          } else {
            setCategories([]);
          }
        });
      // Fetch suppliers
      fetch(`${API_BASE_URL}/api/suppliers`)
        .then((res) => res.json())
        .then((data) => setSuppliers(Array.isArray(data.data) ? data.data : []));
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

  // Al abrir el modal, obtener el empleado del usuario logueado
  useEffect(() => {
    if (isOpen) {
      // Obtener usuario logueado y buscar su employee_id real
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.email) {
        fetch(`${API_BASE_URL}/api/employees`)
          .then((res) => res.json())
          .then((data) => {
            const employees = Array.isArray(data) ? data : (data.data || []);
            const empleado = employees.find((emp: any) => emp.email === user.email || emp.user_id === user.id);
            setForm((prev) => ({
              ...prev,
              employee_id: empleado ? empleado.id : '',
            }));
          });
      }
    }
  }, [isOpen]);

  // Autocompletar producto por código
  useEffect(() => {
    if (!form.code || !products.length) return;
    const found = products.find((p) => p.code === form.code);
    if (found) {
      setForm((prev) => ({ ...prev, product_id: found.id, category_id: found.category_id || "" }));
    } else {
      setForm((prev) => ({ ...prev, product_id: "" }));
    }
    // eslint-disable-next-line
  }, [form.code, products]);

  // Autocompletar código y categoría al seleccionar producto
  useEffect(() => {
    if (!form.product_id || !products.length) return;
    const found = products.find((p) => p.id == form.product_id);
    if (found) {
      setForm((prev) => ({ 
        ...prev, 
        code: found.code || "", 
        category_id: found.category_id || "",
        unit_id: found.unit_id || ""
      }));
    }
    // eslint-disable-next-line
  }, [form.product_id, products]);

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
    if (name === "category_id" && value === "new") {
      closeModal();
      router.push("/settings");
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBarcodeScan = (err: any, result: any) => {
    if (result?.text) {
      setForm((prev) => ({ ...prev, code: result.text }));
      setShowScanner(false);
    }
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
          code: form.code,
          product_id: form.product_id,
          warehouse_id: form.warehouse_id,
          employee_id: form.employee_id, // Se asigna automáticamente
          quantity: Number(form.quantity),
          minimum_stock: 0,
          unit_cost: Number(form.unit_cost),
          category_id: form.category_id,
          supplier_id: form.supplier_id,
        }),
      });
      if (res.ok) {
        setToast({ message: "Inventario registrado exitosamente", type: 'success' });
        setForm({ product_id: "", warehouse_id: "", employee_id: "", category_id: "", supplier_id: "", quantity: "", unit_cost: "", code: "", unit_id: "" });
        setTimeout(() => {
          closeModal();
          if (onSuccess) onSuccess();
        }, 1200);
      } else {
        setToast({ message: "Error al registrar inventario", type: 'error' });
      }
    } catch {
      setToast({ message: "Error de conexión con el servidor", type: 'error' });
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md" style={{maxHeight: "-webkit-fill-available", overflowY: "auto", }}>
            {toast && (
              <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
            <h2 className="text-xl font-bold mb-4">Añadir Inventario</h2>
            <form onSubmit={handleSubmit}>
              {error && <div className="mb-2 text-red-500">{error}</div>}
                            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Código del producto</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="code"
                    value={form.code || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                    placeholder="Ingrese o escanee el código"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Producto</label>
                <div className="flex gap-2">
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
                  {form.code && !products.find((p) => p.code === form.code) && (
                    <button
                      type="button"
                      onClick={() => { closeModal(); router.push("/productos"); }}
                      className="px-2 py-1 bg-primary text-white rounded"
                    >
                      Registrar producto
                    </button>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Almacén</label>
                <div className="flex gap-2">
                  <select
                    name="warehouse_id"
                    value={form.warehouse_id}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Seleccione un almacén</option>
                    <option value="new">+ Nuevo almacén</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                  {form.warehouse_id === "new" && (
                    <button
                      type="button"
                      onClick={() => { closeModal(); router.push("/settings"); }}
                      className="px-2 py-1 bg-primary text-white rounded"
                    >
                      Registrar almacén
                    </button>
                  )}
                </div>
              </div>
              {/* <div className="mb-4">
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
              </div> */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                <input
                  type="text"
                  name="category_name"
                  value={(() => {
                    const cat = categories.find((c) => c.id == form.category_id);
                    return cat ? cat.name : "";
                  })()}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white bg-gray-100 cursor-not-allowed"
                  readOnly
                  tabIndex={-1}
                  placeholder="Categoría del producto"
                />
              </div>
                            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unidad</label>
                <input
                  type="text"
                  name="unit_name"
                  value={(() => {
                    const unit = units.find((u) => u.id == form.unit_id);
                    return unit ? `${unit.name} (${unit.abbreviation})` : "";
                  })()}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white bg-gray-100 cursor-not-allowed"
                  readOnly
                  tabIndex={-1}
                  placeholder="Unidad del producto"
                />
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proveedor</label>
                <select
                  name="supplier_id"
                  value={form.supplier_id || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccione un proveedor</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
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