import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { ProductosInventario } from "@/components/Charts/productos-inventario";
import { CotizacionesAprobadas } from "@/components/Charts/cotizaciones-aprobadas";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";


type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};
export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>
    <div className="mx-auto w-full mb-6">
      <h1 className="text-heading-4 font-bold text-dark dark:text-white">
        Resumen
      </h1>
      </div>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">

        <CotizacionesAprobadas
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
          className="col-span-12 xl:col-span-6"
        />

        <ProductosInventario
          className="col-span-12 xl:col-span-6"
        />

      </div>
    </>
  );
}
