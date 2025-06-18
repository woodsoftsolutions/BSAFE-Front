"use client";

import { TopProductsSkeleton } from "@/components/Tables/inventario-tabla/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Suspense, useRef, useState } from "react";
import AddCotizacionModal from "@/components/Modals/AddCotizacionModal";
import StatsCard from "@/components/StatsBox/StatsCard";
import CotizacionTabla from "@/components/Tables/cotizacion-tabla";


const TablesPage = () => {
  // Ref to trigger table refresh from modal
  const cotizacionesTableRef = useRef<{ fetchCotizaciones: () => void }>(null);
  const [refreshTable, setRefreshTable] = useState(0);

  const handleCotizacionAdded = () => {
    // Forzar refresco de la tabla usando una key reactiva
    setRefreshTable((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <Breadcrumb pageName="Listado de Cotizaciones" />

        {/* Stats Box */}
        {/* <div className="rounded-lg bg-white p-4 shadow-xl dark:bg-gray-dark dark:shadow-card">
          <div className="grid grid-cols-2 xl:grid-cols-4 xl:divide-x divide-gray-200 dark:divide-gray-700">
            <StatsCard title="Cotizaciones" colorClass="text-blue-500" />
            <StatsCard title="Aprobadas" colorClass="text-blue-900" />
            <StatsCard title="Pendientes" colorClass="text-red-500" />
            <StatsCard title="Rechazadas" colorClass="text-yellow-500" />
          </div>
        </div> */}

        {/* Modal Trigger */}
        <AddCotizacionModal
          triggerButtonClassName="max-w-50 px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg self-end"
          onSuccess={handleCotizacionAdded}
        />
        <div className="space-y-10">
          <Suspense fallback={<TopProductsSkeleton />}>
            <CotizacionTabla key={refreshTable} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default TablesPage;
