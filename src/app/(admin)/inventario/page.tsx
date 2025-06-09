"use client";
import { TopProductsSkeleton } from "@/components/Tables/inventario-tabla/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { Suspense, useState } from "react";
import AddInventarioModal from "@/components/Modals/AddInventarioModal";
import InventarioTabla from "@/components/Tables/inventario-tabla";

const TablesPage = () => {
  const [refresh, setRefresh] = useState(0);
  const handleRefresh = () => setRefresh((r) => r + 1);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb pageName="Listado de Inventario" />
      <div className="flex justify-end">
        <AddInventarioModal onSuccess={handleRefresh} />
      </div>
      <div className="space-y-10">
        <Suspense fallback={<TopProductsSkeleton />}>
          <InventarioTabla key={refresh} />
        </Suspense>
      </div>
    </div>
  );
};

export default TablesPage;
