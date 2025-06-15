"use client";
import { useEffect, useState } from "react";
import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export function OverviewCardsGroup() {
  const [data, setData] = useState({
    proveedores: { value: 0, growthRate: 0 },
    productos: { value: 0, growthRate: 0 },
    cotizaciones: { value: 0, growthRate: 0 },
    usuarios: { value: 0, growthRate: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverviewData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5 text-center">
      <OverviewCard
        label="Proveedores"
        data={{
          ...data.proveedores,
          value: loading ? "..." : compactFormat(data.proveedores.value),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Productos en Inventario"
        data={{
          ...data.productos,
          value: loading ? "..." : compactFormat(data.productos.value),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Cotizaciones Pendientes"
        data={{
          ...data.cotizaciones,
          value: loading ? "..." : compactFormat(data.cotizaciones.value),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Usuarios"
        data={{
          ...data.usuarios,
          value: loading ? "..." : compactFormat(data.usuarios.value),
        }}
        Icon={icons.Users}
      />
    </div>
  );
}
