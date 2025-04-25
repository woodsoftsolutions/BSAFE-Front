import { InventarioTabla } from "@/components/Tables/inventario-tabla";
import { TopProductsSkeleton } from "@/components/Tables/inventario-tabla/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Suspense } from "react";
import AddInventarioModal from "@/components/Modals/AddInventarioModal";
import StatsCard from "@/components/StatsBox/StatsCard";

export const metadata: Metadata = {
  title: "Inventario",
};

const TablesPage = () => {
  // export async function InventarioTabla() {
  //   const data = await getInventario();

  return (
    <>
      <div className="flex flex-col gap-6">
        <Breadcrumb pageName="Listado de Inventario" />

        {/* Stats Box */}
        <div className="rounded-lg bg-white p-4 shadow-xl dark:bg-gray-dark dark:shadow-card">
          <div className="grid grid-cols-2 xl:grid-cols-4 xl:divide-x divide-gray-200 dark:divide-gray-700">
            <StatsCard title="Categorias" colorClass="text-blue-500" />
            <StatsCard title="Total" colorClass="text-blue-900" />
            <StatsCard title="Sin Stock" colorClass="text-red-500" />
            <StatsCard title="Stock Bajo" colorClass="text-yellow-500" />
          </div>
        </div>

        {/* Modal Trigger */}
        <AddInventarioModal triggerButtonClassName="max-w-45 px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-dark self-end" />
        <div className="space-y-10">
          <Suspense fallback={<TopProductsSkeleton />}>
            <InventarioTabla />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default TablesPage;
