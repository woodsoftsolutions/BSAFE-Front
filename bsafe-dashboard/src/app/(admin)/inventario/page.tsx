import { InventarioTabla } from "@/components/Tables/inventario-tabla";
import { TopProductsSkeleton } from "@/components/Tables/inventario-tabla/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Suspense } from "react";
import AddInventarioModal from "@/components/Modals/AddInventarioModal";

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

           {/* Modal Trigger */}
        <AddInventarioModal
          triggerButtonClassName="max-w-45 px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-dark self-end"
        />
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
