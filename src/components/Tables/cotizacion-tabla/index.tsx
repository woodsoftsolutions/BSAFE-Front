"use client";

import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrashIcon, PencilSquareIcon } from "@/assets/icons";
import { API_BASE_URL } from "@/lib/constants";

interface EditCotizacionModalProps {
  cotizacion: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  suppliers: any[];
  customers: any[];
  employees: any[];
}

function EditCotizacionModal({ cotizacion, isOpen, onClose, onSave, suppliers, customers, employees }: EditCotizacionModalProps) {
  const [form, setForm] = useState<any>({ ...cotizacion });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>(cotizacion.items || []);
  const [itemForm, setItemForm] = useState({ product_id: '', quantity: '', unit_price: '', total_price: '', specifications: '' });

  useEffect(() => {
    setForm({ ...cotizacion });
    setError(null);
    setItems(cotizacion.items || []);
  }, [cotizacion, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/api/products`)
        .then((res) => res.json())
        .then((data) => setProducts(Array.isArray(data) ? data : (data.data || [])));
      // Obtener usuario logueado y buscar su employee_id real
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.id) {
        fetch(`${API_BASE_URL}/api/employees`)
          .then((res) => res.json())
          .then((data) => {
            const empleados = Array.isArray(data) ? data : (data.data || []);
            const empleado = empleados.find((emp: any) => emp.user_id === user.id);
            setForm((prev: any) => ({
              ...prev,
              employee_id: empleado ? empleado.id : '',
            }));
          })
          .catch(() => {
            setForm((prev: any) => ({
              ...prev,
              employee_id: '',
            }));
          });
      } else {
        setForm((prev: any) => ({
          ...prev,
          employee_id: '',
        }));
      }
    }
  }, [isOpen, cotizacion]);

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
    setForm((prev: any) => ({ ...prev, total_amount: total.toFixed(2) }));
  }, [items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${cotizacion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          supplier_id: 0,
          customer_id: Number(form.customer_id),
          employee_id: Number(form.employee_id),
          total_amount: Number(form.total_amount),
          items,
        }),
      });
      if (res.ok) {
        onSave();
        onClose();
      } else {
        const data = await res.json();
        setError(data.message || "Error al editar la cotización");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Cotización</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="mb-2 text-red-500">{error}</div>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de orden</label>
            <input
              name="order_number"
              value={form.order_number}
              onChange={handleChange}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proveedor</label>
            <select
              name="supplier_id"
              value={form.supplier_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Seleccione un proveedor</option>
              {suppliers.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
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
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
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
              {employees.map((e: any) => (
                <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
              ))}
            </select>
          </div> */}
          <div className="mb-4 flex gap-2">
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
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notas</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto total</label>
            <input
              name="total_amount"
              value={form.total_amount}
              onChange={handleChange}
              type="number"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Productos</label>
            <form onSubmit={handleAddItem} className="flex flex-col gap-2 mb-2">
              <div className="flex gap-2">
                <select name="product_id" value={itemForm.product_id} onChange={handleItemChange} className="w-1/3 px-2 py-1 border rounded" required>
                  <option value="">Producto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input name="quantity" value={itemForm.quantity} onChange={handleItemChange} type="number" min="0" placeholder="Cantidad" className="w-1/4 px-2 py-1 border rounded" required />
                <input name="unit_price" value={itemForm.unit_price} onChange={handleItemChange} type="number" min="0" step="0.01" placeholder="Precio unitario" className="w-1/4 px-2 py-1 border rounded" required />
                <input name="total_price" value={itemForm.total_price} readOnly placeholder="Total" className="w-1/4 px-2 py-1 border rounded bg-gray-100" />
              </div>
              <input name="specifications" value={itemForm.specifications} onChange={handleItemChange} placeholder="Especificaciones (opcional)" className="px-2 py-1 border rounded" />
              <button type="submit" className="self-end px-3 py-1 bg-[#99DFD8] text-white rounded hover:bg-[#24726b]">Agregar producto</button>
            </form>
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
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
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
  );
}

const ProductosModal = ({ isOpen, onClose, productos, nombreCotizacion }: { isOpen: boolean, onClose: () => void, productos: any[], nombreCotizacion: string }) => {
  if (!isOpen) return null;
  // Calcular el total de la suma de todos los productos
  const totalSuma = productos.reduce((acc: number, item: any) => acc + (Number(item.total_price) || 0), 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Productos de la cotización {nombreCotizacion}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Precio unitario</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Especificaciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((item: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{item.product_name || item.product?.name || item.product_id}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${Number(item.unit_price).toFixed(2)}</TableCell>
                <TableCell>${Number(item.total_price).toFixed(2)}</TableCell>
                <TableCell>{item.specifications || '-'}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
              <TableCell className="font-bold">${totalSuma.toFixed(2)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

const CotizacionTabla = forwardRef((props, ref) => {
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editCotizacion, setEditCotizacion] = useState<any | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  // Estado para alertas de acción
  const [alerta, setAlerta] = useState<string | null>(null);
  // Estado para navegación de pestañas
  const [tab, setTab] = useState<'pending' | 'approved' | 'cancelled'>('pending');
  const [showProductos, setShowProductos] = useState(false);
  const [productosCotizacion, setProductosCotizacion] = useState([]);
  const [nombreCotizacion, setNombreCotizacion] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const cacheRef = useRef<{ [key: string]: any[] }>({});

  const fetchCotizaciones = async (pageIndex = 0, pageSize = 10) => {
    const cacheKey = `${pageIndex}_${pageSize}`;
    if (cacheRef.current[cacheKey]) {
      setCotizaciones(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/paginated?per_page=${pageSize}&page=${pageIndex + 1}`);
      if (!res.ok) throw new Error("Error al cargar cotizaciones");
      const data = await res.json();
      const cotizacionesData = Array.isArray(data.data) ? data.data : data.data?.data || [];
      cacheRef.current[cacheKey] = cotizacionesData;
      setCotizaciones(cotizacionesData);
    } catch (err) {
      setError("Error al cargar cotizaciones");
    } finally {
      setLoading(false);
    }
  };

  const fetchSelects = async () => {
    const [sup, cus, emp] = await Promise.all([
      fetch(`${API_BASE_URL}/api/suppliers`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/customers`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/employees`).then((res) => res.json()),
    ]);
    setSuppliers(Array.isArray(sup) ? sup : (sup.data || []));
    setCustomers(Array.isArray(cus) ? cus : (cus.data || []));
    setEmployees(Array.isArray(emp) ? emp : (emp.data || []));
  };

  useEffect(() => {
    fetchCotizaciones(page, rowsPerPage);
    fetchSelects();
  }, [page, rowsPerPage]);

  const handleEdit = (cot: any) => {
    setEditCotizacion(cot);
    setShowEdit(true);
  };

  const handleSaveEdit = () => {
    setShowEdit(false);
    setEditCotizacion(null);
    fetchCotizaciones(page, rowsPerPage);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta cotización?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCotizaciones(page, rowsPerPage);
      } else {
        alert("Error al eliminar la cotización");
      }
    } catch (err) {
      alert("Error de conexión al eliminar");
    }
  };

  // Filtrar cotizaciones según el estado
  const cotizacionesPendientes = cotizaciones.filter(cot => cot.status === "pending_approval");
  const cotizacionesAprobadas = cotizaciones.filter(cot => cot.status === "approved");
  const cotizacionesRechazadas = cotizaciones.filter(cot => cot.status === "rejected" || cot.status === "cancelled");

  // Acción para aprobar cotización
  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setAlerta("La cotización se aprobó correctamente.");
        fetchCotizaciones(page, rowsPerPage);
      } else {
        alert("Error al aprobar la cotización");
      }
    } catch (err) {
      alert("Error de conexión al aprobar");
    }
  };

  // Acción para rechazar cotización
  const handleReject = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setAlerta("La cotización se canceló correctamente.");
        fetchCotizaciones(page, rowsPerPage);
      } else {
        alert("Error al rechazar la cotización");
      }
    } catch (err) {
      alert("Error de conexión al rechazar");
    }
  };

  // Cambia la función del botón para obtener los productos desde la API
  const handleVerProductos = async (cot: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${cot.id}`);
      if (!res.ok) throw new Error("Error al obtener productos de la cotización");
      const data = await res.json();
      // data.items debe contener los productos asociados
      setProductosCotizacion(Array.isArray(data.items) ? data.items : []);
      setNombreCotizacion(cot.order_number);
      setShowProductos(true);
    } catch (err) {
      setProductosCotizacion([]);
      setNombreCotizacion(cot.order_number);
      setShowProductos(true);
    }
  };

  // Render tabla según la pestaña
  const renderTabla = (data: any[], estado: string, color: string) => (
    <Table>
      <TableHeader>
        <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
          <TableHead>N° Orden</TableHead>
          <TableHead>Proveedor</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Empleado</TableHead>
          <TableHead>Fecha orden</TableHead>
          <TableHead>Monto total</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Productos</TableHead>
          {estado === 'pending_approval' && <TableHead className="text-right xl:pr-7.5">Acciones</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((cot) => (
          <TableRow key={cot.id} className="text-base font-medium text-dark dark:text-white">
            <TableCell>{cot.order_number}</TableCell>
            <TableCell>{cot.supplier?.name || cot.supplier_id || '-'}</TableCell>
            <TableCell>{cot.customer?.name || cot.customer_id || '-'}</TableCell>
            <TableCell>{cot.employee ? `${cot.employee.first_name} ${cot.employee.last_name}` : cot.employee_id || '-'}</TableCell>
            <TableCell>{cot.order_date ? new Date(cot.order_date).toLocaleDateString() : '-'}</TableCell>
            <TableCell>{cot.total_amount ? `$${cot.total_amount}` : '-'}</TableCell>
            <TableCell>
              <div className={color + " max-w-fit rounded-full px-3.5 py-1 text-sm font-medium"}>
                {estado === 'pending_approval' && 'Pendiente por aprobación'}
                {estado === 'approved' && 'Aprobada'}
                {estado === 'cancelled' && 'Rechazada'}
              </div>
            </TableCell>
            <TableCell>
              <button
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                onClick={() => handleVerProductos(cot)}
              >
                Ver productos
              </button>
            </TableCell>
            {estado === 'pending_approval' && (
              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                    onClick={() => handleApprove(cot.id)}
                  >
                    Aceptar
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    onClick={() => handleReject(cot.id)}
                  >
                    Cancelar
                  </button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  useImperativeHandle(ref, () => ({
    fetchCotizaciones,
  }));

  CotizacionTabla.displayName = "CotizacionTabla";

  if (loading) return <div className="p-4">Cargando cotizaciones...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Menú de navegación de pestañas */}
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${tab === 'pending' ? 'border-[#FFA70B] text-[#FFA70B] bg-white dark:bg-gray-dark' : 'border-transparent text-gray-500 bg-gray-100 dark:bg-gray-700'}`}
          onClick={() => setTab('pending')}
        >
          Pendientes por aprobación
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${tab === 'approved' ? 'border-[#219653] text-[#219653] bg-white dark:bg-gray-dark' : 'border-transparent text-gray-500 bg-gray-100 dark:bg-gray-700'}`}
          onClick={() => setTab('approved')}
        >
          Aprobadas
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${tab === 'cancelled' ? 'border-[#D34053] text-[#D34053] bg-white dark:bg-gray-dark' : 'border-transparent text-gray-500 bg-gray-100 dark:bg-gray-700'}`}
          onClick={() => setTab('cancelled')}
        >
          Rechazadas
        </button>
      </div>
      {alerta && (
        <div className="mb-4 px-4 py-2 rounded bg-green-100 text-green-800 font-semibold text-center">
          {alerta}
          <button className="ml-4 text-green-900 font-bold" onClick={() => setAlerta(null)}>X</button>
        </div>
      )}
      {tab === 'pending' && renderTabla(cotizacionesPendientes, 'pending_approval', 'bg-[#FFA70B]/[0.08] text-[#FFA70B]')}
      {tab === 'approved' && renderTabla(cotizacionesAprobadas, 'approved', 'bg-[#219653]/[0.08] text-[#219653]')}
      {tab === 'cancelled' && renderTabla(cotizacionesRechazadas, 'cancelled', 'bg-[#D34053]/[0.08] text-[#D34053]')}
      <div className="flex justify-end mt-4">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
        <span className="mx-2">Página {page + 1}</span>
        <button onClick={() => setPage(page + 1)}>Siguiente</button>
      </div>
      <ProductosModal
        isOpen={showProductos}
        onClose={() => setShowProductos(false)}
        productos={productosCotizacion}
        nombreCotizacion={nombreCotizacion}
      />
      {showEdit && editCotizacion && (
        <EditCotizacionModal
          cotizacion={editCotizacion}
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onSave={handleSaveEdit}
          suppliers={suppliers}
          customers={customers}
          employees={employees}
        />
      )}
    </div>
  );
});

export default CotizacionTabla;
