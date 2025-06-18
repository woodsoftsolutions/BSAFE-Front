"use client";

import { UsuariosTabla } from "@/components/Tables/usuarios-tabla";
import { TopProductsSkeleton } from "@/components/Tables/usuarios-tabla/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Suspense, useState } from "react";
import AddUserModal from "@/components/Modals/AddUserModal";


const TablesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);

  const handleUserCreated = () => {
    setShowAddModal(false);
    setRefreshTable((prev) => prev + 1); // Cambia la key para forzar refresco
  };

  return (
    <> 
    <div className="flex flex-col gap-6">
    <Breadcrumb pageName="Listado de Usuarios" />
        <AddUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleUserCreated}
        />
      <div className="space-y-10">
        
        <Suspense fallback={<TopProductsSkeleton />}>
          <UsuariosTabla key={refreshTable} />
        </Suspense>
      </div>
      
      </div>
    </>
  );
};

export default TablesPage;
