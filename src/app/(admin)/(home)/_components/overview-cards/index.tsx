import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { proveedores, productos, cotizaciones, usuarios } = await getOverviewData();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5 text-center">
      <OverviewCard
        label="Proveedores"
        data={{
          ...proveedores,
          value: compactFormat(proveedores.value),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Productos en Inventario"
        data={{
          ...productos,
          value: compactFormat(productos.value),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Cotizaciones Pendientes"
        data={{
          ...cotizaciones,
          value: compactFormat(cotizaciones.value),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Usuarios"
        data={{
          ...usuarios,
          value: compactFormat(usuarios.value),
        }}
        Icon={icons.Users}
      />
    </div>
  );
}
