"use client";

import ProveedoresTabla from "@/components/Tables/proveedores-tabla";
import { TopProductsSkeleton } from "@/components/Tables/proveedores-tabla/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Suspense, useState } from "react";
import AddProveedoresModal from "@/components/Modals/AddProveedoresModal";



const TablesPage = () => {
  // Refrescar tabla desde el padre
  const [refresh, setRefresh] = useState(0);
  const handleRefresh = () => setRefresh((r) => r + 1);

  return (
    <>
      <div className="flex flex-col gap-6">
        <Breadcrumb pageName="Listado de Proveedores" />
        <div className="flex justify-end">
          <AddProveedoresModal onSuccess={handleRefresh} />
        </div>
        <div className="space-y-10">
          <Suspense fallback={<TopProductsSkeleton />}>
            <ProveedoresTabla key={refresh} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default TablesPage;
