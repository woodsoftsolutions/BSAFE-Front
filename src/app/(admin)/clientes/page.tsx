"use client";
import { useState, Suspense } from "react";
import ClientesTabla from "@/components/Tables/clientes-tabla";
import { TopProductsSkeleton } from "@/components/Tables/clientes-tabla/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddClientModal from "@/components/Modals/AddClientModal";
import { Metadata } from "next";


const TablesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);

  const handleClientCreated = () => {
    setShowAddModal(false);
    setRefreshTable((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <Breadcrumb pageName="Listado de Clientes" />
       
        <AddClientModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleClientCreated}
        />
        <div className="space-y-10">
          <Suspense fallback={<TopProductsSkeleton />}>
            <ClientesTabla key={refreshTable} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default TablesPage;
