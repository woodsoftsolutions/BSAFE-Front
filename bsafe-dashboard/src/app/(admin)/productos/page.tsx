import { ProductosTabla } from "@/components/Tables/productos-tabla";
import { TopProductsSkeleton } from "@/components/Tables/productos-tabla/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Suspense } from "react";
import AddProductModal from "@/components/Modals/AddProductModal";

export const metadata: Metadata = {
  title: "Productos",
};

const TablesPage = () => {

  // export async function ProductosTabla() {
  //   const data = await getProductos(); 

return (
    <> 
    <div className="flex flex-col gap-6">
    <Breadcrumb pageName="Listado de Productos" />

           {/* Modal Trigger */}
        <AddProductModal
          triggerButtonClassName="max-w-45 px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-dark self-end"
        />
      <div className="space-y-10">
        
        <Suspense fallback={<TopProductsSkeleton />}>
          <ProductosTabla />
        </Suspense>
      </div>
      
      </div>
    </>
  );
};

export default TablesPage;
