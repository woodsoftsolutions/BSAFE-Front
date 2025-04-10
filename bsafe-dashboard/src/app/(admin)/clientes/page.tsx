import { ClientesTabla } from "@/components/Tables/clientes-tabla";
import { TopProductsSkeleton } from "@/components/Tables/clientes-tabla/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Suspense } from "react";
import AddClientModal from "@/components/Modals/AddClientModal";


export const metadata: Metadata = {
  title: "Clientes",
};

const TablesPage = () => {

  // export async function ClientesTabla() {
  //   const data = await getClientes(); 



return (
    <> 
    <div className="flex flex-col gap-6">
    <Breadcrumb pageName="Listado de Clientes" />

            {/* Modal Trigger */}
        <AddClientModal
          triggerButtonClassName="max-w-45 px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-dark self-end"
        />

      <div className="space-y-10">
        
        <Suspense fallback={<TopProductsSkeleton />}>
          <ClientesTabla />
        </Suspense>
      </div>
      
      </div>

    </>
  );
};

export default TablesPage;
