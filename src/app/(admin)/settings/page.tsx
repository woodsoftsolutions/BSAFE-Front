"use client";
import { useEffect, useState } from "react";
// Update the import path below if the actual path is different
import { PersonalInfoForm } from "../pages/settings/_components/personal-info";
import { UploadPhotoForm } from "../pages/settings/_components/upload-photo";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PencilSquareIcon, TrashIcon } from "@/assets/icons";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/constants";

export default function SettingsPage() {
  const [tab, setTab] = useState<'units' | 'categories' | 'warehouses'>('units');
  const [units, setUnits] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [unitForm, setUnitForm] = useState({ name: '', abbreviation: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [warehouseForm, setWarehouseForm] = useState({ name: '', location: '', is_active: true });
  const [loading, setLoading] = useState(false);

  // Fetch units, categories y warehouses
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/units`).then(res => res.json()).then(data => setUnits(Array.isArray(data.data) ? data.data : []));
    fetch(`${API_BASE_URL}/api/categories`).then(res => res.json()).then(data => {
      if (Array.isArray(data.data?.categorias)) setCategories(data.data.categorias);
      else if (data.data && Array.isArray(data.data)) setCategories(data.data);
      else setCategories([]);
    });
    fetch(`${API_BASE_URL}/api/warehouses`).then(res => res.json()).then(data => setWarehouses(Array.isArray(data.data) ? data.data : []));
  }, []);

  // Handlers for units
  const handleUnitChange = (e: any) => setUnitForm({ ...unitForm, [e.target.name]: e.target.value });
  const handleAddUnit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`${API_BASE_URL}/api/units`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(unitForm) });
    setUnitForm({ name: '', abbreviation: '' });
    fetch(`${API_BASE_URL}/api/units`).then(res => res.json()).then(data => setUnits(Array.isArray(data.data) ? data.data : []));
    setLoading(false);
  };
  const handleDeleteUnit = async (id: number) => {
    await fetch(`${API_BASE_URL}/api/units/${id}`, { method: 'DELETE' });
    fetch(`${API_BASE_URL}/api/units`).then(res => res.json()).then(data => setUnits(Array.isArray(data.data) ? data.data : []));
  };

  // Handlers for categories
  const handleCategoryChange = (e: any) => setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  const handleAddCategory = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`${API_BASE_URL}/api/categories`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(categoryForm) });
    setCategoryForm({ name: '', description: '' });
    fetch(`${API_BASE_URL}/api/categories`).then(res => res.json()).then(data => {
      if (Array.isArray(data.data?.categorias)) setCategories(data.data.categorias);
      else if (data.data && Array.isArray(data.data)) setCategories(data.data);
      else setCategories([]);
    });
    setLoading(false);
  };
  const handleDeleteCategory = async (id: number) => {
    await fetch(`${API_BASE_URL}/api/categories/${id}`, { method: 'DELETE' });
    fetch(`${API_BASE_URL}/api/categories`).then(res => res.json()).then(data => {
      if (Array.isArray(data.data?.categorias)) setCategories(data.data.categorias);
      else if (data.data && Array.isArray(data.data)) setCategories(data.data);
      else setCategories([]);
    });
  };

  // Handlers for warehouses
  const handleWarehouseChange = (e: any) => setWarehouseForm({ ...warehouseForm, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const handleAddWarehouse = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`${API_BASE_URL}/api/warehouses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(warehouseForm) });
    setWarehouseForm({ name: '', location: '', is_active: true });
    fetch(`${API_BASE_URL}/api/warehouses`).then(res => res.json()).then(data => setWarehouses(Array.isArray(data.data) ? data.data : []));
    setLoading(false);
  };
  const handleDeleteWarehouse = async (id: number) => {
    await fetch(`${API_BASE_URL}/api/warehouses/${id}`, { method: 'DELETE' });
    fetch(`${API_BASE_URL}/api/warehouses`).then(res => res.json()).then(data => setWarehouses(Array.isArray(data.data) ? data.data : []));
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        {/* <UploadPhotoForm /> */}
        <PersonalInfoForm />
      </div>
      <div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <Tabs
            value={tab}
            onChange={(_event, newValue) => setTab(newValue)}
            className="mb-6"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Unidades" value="units" />
            <Tab label="Categorías" value="categories" />
            <Tab label="Almacenes" value="warehouses" />
          </Tabs>
          {tab === 'units' && (
            <div>
              <form onSubmit={handleAddUnit} className="mb-4 flex gap-4">
                <input name="name" value={unitForm.name} onChange={handleUnitChange} placeholder="Nombre" className="border rounded px-2 py-1" required />
                <input name="abbreviation" value={unitForm.abbreviation} onChange={handleUnitChange} placeholder="Abreviatura" className="border rounded px-2 py-1" required />
                <button type="submit" className="bg-primary text-white px-4 py-1 rounded" disabled={loading}>Crear</button>
              </form>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Abreviatura</TableHead>
                    <TableHead>Opciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {units.map((unit: any) => (
                    <TableRow key={unit.id}>
                      <TableCell>{unit.name}</TableCell>
                      <TableCell>{unit.abbreviation}</TableCell>
                      <TableCell>
                        <button className="mr-2 hover:text-primary"><PencilSquareIcon /></button>
                        <button className="hover:text-red-500" onClick={() => handleDeleteUnit(unit.id)}><TrashIcon /></button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {tab === 'categories' && (
            <div>
              <form onSubmit={handleAddCategory} className="mb-4 flex gap-4">
                <input name="name" value={categoryForm.name} onChange={handleCategoryChange} placeholder="Nombre" className="border rounded px-2 py-1" required />
                <button type="submit" className="bg-primary text-white px-4 py-1 rounded" disabled={loading}>Crear</button>
              </form>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Opciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat: any) => (
                    <TableRow key={cat.id}>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell>
                        <button className="mr-2 hover:text-primary"><PencilSquareIcon /></button>
                        <button className="hover:text-red-500" onClick={() => handleDeleteCategory(cat.id)}><TrashIcon /></button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {tab === 'warehouses' && (
            <div>
              <form onSubmit={handleAddWarehouse} className="mb-4 flex gap-4">
                <input name="name" value={warehouseForm.name} onChange={handleWarehouseChange} placeholder="Nombre" className="border rounded px-2 py-1" required />
                <input name="location" value={warehouseForm.location} onChange={handleWarehouseChange} placeholder="Ubicación" className="border rounded px-2 py-1" required />
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_active" checked={warehouseForm.is_active} onChange={handleWarehouseChange} /> Activo
                </label>
                <button type="submit" className="bg-primary text-white px-4 py-1 rounded" disabled={loading}>Crear</button>
              </form>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Opciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((wh: any) => (
                    <TableRow key={wh.id}>
                      <TableCell>{wh.name}</TableCell>
                      <TableCell>{wh.location}</TableCell>
                      <TableCell>{wh.is_active ? 'Sí' : 'No'}</TableCell>
                      <TableCell>
                        <button className="mr-2 hover:text-primary"><PencilSquareIcon /></button>
                        <button className="hover:text-red-500" onClick={() => handleDeleteWarehouse(wh.id)}><TrashIcon /></button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
