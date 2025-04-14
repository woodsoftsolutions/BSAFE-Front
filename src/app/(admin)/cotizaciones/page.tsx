import { CotizacionTabla } from "@/components/Tables/cotizacion-tabla";
import { TopProductsSkeleton } from "@/components/Tables/inventario-tabla/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Suspense } from "react";
import AddCotizacionModal from "@/components/modals/AddCotizacionModal";
import StatsCard from "@/components/StatsBox/StatsCard";

export const metadata: Metadata = {
  title: "Cotizaciones",
};

const TablesPage = () => {
  // export async function InventarioTabla() {
  //   const data = await getInventario();

  return (
    <>
      <div className="flex flex-col gap-6">
        <Breadcrumb pageName="Listado de Cotizaciones" />

        {/* Stats Box */}
        <div className="rounded-lg bg-white p-4 shadow-xl dark:bg-gray-dark dark:shadow-card">
          <div className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-700">
            <StatsCard title="Cotizaciones" colorClass="text-blue-500" />
            <StatsCard title="Aprobadas" colorClass="text-blue-900" />
            <StatsCard title="Pendientes" colorClass="text-red-500" />
            <StatsCard title="Rechazadas" colorClass="text-yellow-500" />
          </div>
        </div>

        {/* Modal Trigger */}
        <AddCotizacionModal triggerButtonClassName="max-w-50 px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-dark self-end" />
        <div className="space-y-10">
          <Suspense fallback={<TopProductsSkeleton />}>
            <CotizacionTabla />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default TablesPage;
