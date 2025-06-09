import { useEffect, useState } from "react";

function CotizacionesAprobadasClient({ className, timeFrame }: { className?: string; timeFrame?: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/charts/weeks-profit?timeFrame=${timeFrame || "2025"}`)
      .then((res) => res.json())
      .then((data) => setData(data.data))
      .finally(() => setLoading(false));
  }, [timeFrame]);

  if (loading) return <div className={className}>Cargando cotizaciones aprobadas...</div>;
  if (!data) return <div className={className}>Sin datos</div>;

  // Aquí deberías renderizar el mismo contenido que CotizacionesAprobadas original, usando 'data'
  return (
    <div className={className}>
      <h2 className="text-body-2xlg font-bold text-dark dark:text-white mb-2">Cotizaciones aprobadas</h2>
      {/* Renderiza tu gráfico aquí usando 'data' */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

function ProductosInventarioClient({ className }: { className?: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/inventory-balances")
      .then((res) => res.json())
      .then((data) => setData(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={className}>Cargando inventario...</div>;
  if (!data) return <div className={className}>Sin datos</div>;

  // Renderiza tu tabla o gráfico aquí usando 'data'
  return (
    <div className={className}>
      <h2 className="text-body-2xlg font-bold text-dark dark:text-white mb-2">Productos en Inventario</h2>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}

export { CotizacionesAprobadasClient, ProductosInventarioClient };