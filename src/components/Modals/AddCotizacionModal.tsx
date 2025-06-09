"use client";

import React, { useState, useEffect, useRef } from "react";

interface AddCotizacionModalProps {
  triggerButtonClassName?: string;
  onSuccess?: () => void;
}

const AddCotizacionModal: React.FC<AddCotizacionModalProps> = ({ triggerButtonClassName, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const headerHiddenRef = useRef(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({
    order_number: "",
    order_type: "quotation",
    status: "draft",
    supplier_id: "",
    customer_id: "",
    employee_id: "",
    order_date: "",
    expected_delivery_date: "",
    notes: "",
    total_amount: ""
  });
  const [itemForm, setItemForm] = useState({ product_id: '', quantity: '', unit_price: '', total_price: '', specifications: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      fetch("http://localhost:8000/api/suppliers")
        .then((res) => res.json())
        .then((data) => setSuppliers(Array.isArray(data) ? data : (data.data || [])));
      fetch("http://localhost:8000/api/customers")
        .then((res) => res.json())
        .then((data) => setCustomers(Array.isArray(data) ? data : (data.data || [])));
      fetch("http://localhost:8000/api/products")
        .then((res) => res.json())
        .then((data) => setProducts(Array.isArray(data) ? data : (data.data || [])));
      // Obtener usuario logueado y buscar su employee_id real
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log("user from localStorage:", user);
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      if (user && user.email) {
        fetch("http://localhost:8000/api/employees")
          .then((res) => res.json())
          .then((data) => {
            const employees = Array.isArray(data) ? data : (data.data || []);
            // Busca por email o user_id según tu backend
            const empleado = employees.find((emp: any) => emp.email === user.email || emp.user_id === user.id);
            setForm((prev) => ({
              ...prev,
              employee_id: empleado ? empleado.id : '',
              order_date: todayStr,
            }));
          })
          .catch(() => {
            setForm((prev) => ({
              ...prev,
              employee_id: '',
              order_date: todayStr,
            }));
          });
      } else {
        setForm((prev) => ({
          ...prev,
          employee_id: '',
          order_date: todayStr,
        }));
      }
    }
  }, [isOpen]);

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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItemForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'quantity' || name === 'unit_price') {
      const quantity = name === 'quantity' ? value : itemForm.quantity;
      const unit_price = name === 'unit_price' ? value : itemForm.unit_price;
      setItemForm((prev) => ({ ...prev, total_price: (parseFloat(quantity) * parseFloat(unit_price) || 0).toFixed(2) }));
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.product_id || !itemForm.quantity || !itemForm.unit_price) return;
    setItems((prev) => [...prev, { ...itemForm, product_id: Number(itemForm.product_id), quantity: Number(itemForm.quantity), unit_price: Number(itemForm.unit_price), total_price: Number(itemForm.total_price) }]);
    setItemForm({ product_id: '', quantity: '', unit_price: '', total_price: '', specifications: '' });
  };

  const handleRemoveItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    // Auto-calculate total_amount
    const total = items.reduce((sum, item) => sum + (Number(item.total_price) || 0), 0);
    setForm((prev) => ({ ...prev, total_amount: total.toFixed(2) }));
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Validar que haya al menos un producto
    if (items.length === 0) {
      setError("Debe agregar al menos un producto a la cotización.");
      setLoading(false);
      return;
    }
    try {
      // Generar número de orden automáticamente si está vacío
      let order_number = form.order_number;
      if (!order_number) {
        const now = new Date();
        order_number = `ORD-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${Math.floor(Math.random()*10000)}`;
      }
      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          order_number,
          supplier_id: 1,
          customer_id: Number(form.customer_id),
          employee_id: Number(form.employee_id),
          total_amount: Number(form.total_amount),
          items,
        }),
      });
      if (res.ok) {
        setForm({
          order_number: "",
          order_type: "quotation",
          status: "draft",
          supplier_id: "",
          customer_id: "",
          employee_id: "",
          order_date: "",
          expected_delivery_date: "",
          notes: "",
          total_amount: ""
        });
        setItems([]);
        closeModal();
        if (onSuccess) onSuccess(); // <-- Esto ya está, pero asegúrate de usarlo
      } else {
        const data = await res.json();
        setError(data.message || "Error al guardar la cotización");
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
        Añadir Cotización +
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Añadir Cotización</h2>
            <form onSubmit={handleSubmit}>
              {error && <div className="mb-2 text-red-500">{error}</div>}
              {/* Detalles generales */}
              {/* El número de orden es autogenerado y no visible */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de orden</label>
                <input
                  name="order_number"
                  value={form.order_number}
                  onChange={handleChange}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: ORD-2025-001"
                  required
                />
              </div> */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cliente</label>
                <select
                  name="customer_id"
                  value={form.customer_id}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              {/* <div className="mb-4 flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de orden</label>
                  <input
                    name="order_date"
                    value={form.order_date}
                    onChange={handleChange}
                    type="date"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de entrega</label>
                  <input
                    name="expected_delivery_date"
                    value={form.expected_delivery_date}
                    onChange={handleChange}
                    type="date"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div> */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notas</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
                  placeholder="Notas de la cotización"
                />
              </div>
              {/* Sección de productos */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Productos</label>
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex gap-2">
                    <select name="product_id" value={itemForm.product_id} onChange={handleItemChange} className="w-1/3 px-2 py-1 border rounded">
                      <option value="">Producto</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input name="quantity" value={itemForm.quantity} onChange={handleItemChange} type="number" min="0" placeholder="Cantidad" className="w-1/4 px-2 py-1 border rounded" />
                    <input name="unit_price" value={itemForm.unit_price} onChange={handleItemChange} type="number" min="0" step="0.01" placeholder="Precio unitario" className="w-1/4 px-2 py-1 border rounded"  />
                    <input name="total_price" value={itemForm.total_price} readOnly placeholder="Total" className="w-1/4 px-2 py-1 border rounded bg-gray-100" />
                  </div>
                  <input name="specifications" value={itemForm.specifications} onChange={handleItemChange} placeholder="Especificaciones (opcional)" className="px-2 py-1 border rounded" />
                  <button type="button" onClick={handleAddItem} className="self-end px-3 py-1 bg-[#99DFD8] text-white rounded hover:bg-[#24726b]">Agregar producto</button>
                </div>
                <ul className="space-y-1">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{products.find(p => p.id === item.product_id)?.name || item.product_id}</span>
                      <span>x{item.quantity}</span>
                      <span>@ ${item.unit_price}</span>
                      <span>= ${item.total_price}</span>
                      {item.specifications && <span className="italic">({item.specifications})</span>}
                      <button type="button" onClick={() => handleRemoveItem(idx)} className="ml-2 text-red-500 hover:underline">Eliminar</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4 text-right font-bold text-lg">
                Monto total: ${form.total_amount}
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

export default AddCotizacionModal;