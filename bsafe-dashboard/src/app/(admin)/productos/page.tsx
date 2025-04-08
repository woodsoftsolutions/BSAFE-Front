import { ProductosTabla } from "@/components/Tables/productos-tabla";
import { TopProductsSkeleton } from "@/components/Tables/productos-tabla/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Productos",
};

const TablesPage = () => {

  // export async function ProductosTabla() {
  //   const data = await getProductos(); 

return (
    <> 
    <div className="flex flex-col gap-6">
<div className="flex justify-between items-center px-6 py-4 bg-[#99DFD8] dark:bg-[#24726b] rounded-[10px]">
        

        <button className="px-15 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-100 dark:bg-gray-dark dark:text-white">
          Listado <br></br> De Productos
        </button>
          <button className="px-15 py-2 bg-none text-gray-700 dark:text-white dark:hover:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-dark">
            Añadir <br></br> producto
          </button>
          <button className="px-15 py-2 bg-none text-gray-700 dark:text-white dark:hover:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-dark">
            Eliminar <br></br> producto
          </button>
          <button className="px-15 py-2 bg-none text-gray-700 dark:text-white dark:hover:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-dark">
            Actualizar <br></br> producto
          </button>

      </div>
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
