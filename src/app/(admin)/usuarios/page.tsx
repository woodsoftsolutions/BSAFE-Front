import { UsuariosTabla } from "@/components/Tables/usuarios-tabla";
import { TopProductsSkeleton } from "@/components/Tables/usuarios-tabla/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Suspense } from "react";
import AddUserModal from "@/components/Modals/AddUserModal";

export const metadata: Metadata = {
  title: "Usuarios",
};

const TablesPage = () => {

  // export async function UsuariosTabla() {
  //   const data = await getUsuarios(); 

return (
    <> 
    <div className="flex flex-col gap-6">
    <Breadcrumb pageName="Listado de Usuarios" />

             {/* Modal Trigger */}
        <AddUserModal
          triggerButtonClassName="max-w-50 px-5 py-2 bg-[#99DFD8] hover:bg-[#24726b] hover:text-white text-gray-700 dark:text-white dark:hover:text-white dark:bg-[#24726b] font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-dark self-end"
        />
      <div className="space-y-10">
        
        <Suspense fallback={<TopProductsSkeleton />}>
          <UsuariosTabla />
        </Suspense>
      </div>
      
      </div>
    </>
  );
};

export default TablesPage;
