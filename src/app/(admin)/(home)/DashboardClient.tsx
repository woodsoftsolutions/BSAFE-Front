"use client";
import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { CotizacionesAprobadasClient, ProductosInventarioClient } from "./ChartsClient";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";

export default function DashboardClient({ searchParams }: { searchParams?: { selected_time_frame?: string } }) {
  const selected_time_frame = searchParams?.selected_time_frame;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  const [summary, setSummary] = useState<{
    suppliers_count: number;
    products_count: number;
    pending_quotations: number;
    active_users: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/orders/summary")
      .then((res) => res.json().then((data) => {
        setSummary(data.data);
        setLoading(false);
      }))
      .catch((err) => {
        setLoading(false);
        setSummary(null);
      });
  }, []);

  return (
    <>
      <div className="mx-auto w-full mb-6">
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Resumen
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg bg-white p-4 shadow-xl dark:bg-gray-dark dark:shadow-card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {loading ? '...' : summary?.suppliers_count ?? '-'}
          </div>
          <div className="text-gray-700 dark:text-gray-200 mt-2">Proveedores registrados</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-xl dark:bg-gray-dark dark:shadow-card text-center">
          <div className="text-2xl font-bold text-green-600">
            {loading ? '...' : summary?.products_count ?? '-'}
          </div>
          <div className="text-gray-700 dark:text-gray-200 mt-2">Productos registrados</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-xl dark:bg-gray-dark dark:shadow-card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {loading ? '...' : summary?.pending_quotations ?? '-'}
          </div>
          <div className="text-gray-700 dark:text-gray-200 mt-2">Cotizaciones pendientes</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-xl dark:bg-gray-dark dark:shadow-card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {loading ? '...' : summary?.active_users ?? '-'}
          </div>
          <div className="text-gray-700 dark:text-gray-200 mt-2">Usuarios activos</div>
        </div>
      </div>
      {/* <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense> */}

      {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <CotizacionesAprobadasClient
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
          className="col-span-12 xl:col-span-6"
        />
        <ProductosInventarioClient
          className="col-span-12 xl:col-span-6"
        />
      </div> */}
    </>
  );
}
