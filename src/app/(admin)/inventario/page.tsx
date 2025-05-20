"use client";
import { Suspense, useState } from "react";
import { InventarioTabla } from "@/components/Tables/inventario-tabla";
import { TopProductsSkeleton } from "@/components/Tables/inventario-tabla/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddInventarioModal from "@/components/Modals/AddInventarioModal";
import StatsCard from "@/components/StatsBox/StatsCard";
import { Producto, SortConfig } from "@/types";

const TablesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Función para ordenar los datos
  const requestSort = (key: keyof Producto) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Función para obtener los datos filtrados y ordenados
  const getFilteredAndSortedData = (data: Producto[]) => {
    let filteredData = [...data];

    // Filtrar por búsqueda
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some(
          (val) =>
            val &&
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filteredData = filteredData.filter(
        (item) => item.categoria === selectedCategory
      );
    }

    // Ordenar
    if (sortConfig !== null) {
      filteredData.sort((a, b) => {
        // Asegurarnos que la propiedad existe
        const key = sortConfig.key as keyof Producto;
        const valueA = a[key] || 0;
        const valueB = b[key] || 0;

        if (valueA < valueB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb pageName="Listado de Inventario" />
      <div className="rounded-lg bg-white p-4 shadow-xl dark:bg-gray-dark dark:shadow-card">
        <div className="grid grid-cols-2 xl:grid-cols-4 xl:divide-x divide-gray-200 dark:divide-gray-700">
          <StatsCard title="Categorias" colorClass="text-blue-500" />
          <StatsCard title="Total" colorClass="text-blue-900" />
          <StatsCard title="Sin Stock" colorClass="text-red-500" />
          <StatsCard title="Stock Bajo" colorClass="text-yellow-500" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-2.5"></span>
          </div>
          <div className="w-full sm:w-48">
            <select
              className="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              <option value="electronica">Electrónica</option>
              <option value="ropa">Ropa</option>
              <option value="alimentos">Alimentos</option>
            </select>
          </div>
        </div>
        <AddInventarioModal
          triggerButtonClassName="px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-dark"
        />
      </div>
      <div className="space-y-10">
        <Suspense fallback={<TopProductsSkeleton />}>
          <InventarioTabla
            searchTerm={searchTerm}
            sortConfig={sortConfig}
            selectedCategory={selectedCategory}
            onSort={requestSort}
            getFilteredAndSortedData={getFilteredAndSortedData}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default TablesPage;
