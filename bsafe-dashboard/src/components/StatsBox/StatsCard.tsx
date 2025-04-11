"use client";

import { useEffect, useState } from "react";
import { fetchStats } from "./fetch"; // Import the fetchStats function

interface StatsCardProps {
  title: string;
  colorClass: string;
}

const StatsCard = ({ title, colorClass }: StatsCardProps) => {
  const [data, setData] = useState<{ value: number; subValue?: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stats = await fetchStats();

        // Determine the data to display based on the title
        let result;
        switch (title) {
          case "Categorias":
            result = { value: stats.categorias };
            break;
          case "Total Productos":
            result = { value: stats.totalProducts };
            break;
          case "Sin Stock":
            result = { value: stats.sinStock.cantidad, subValue: stats.sinStock.ordenado };
            break;
          case "Stock Bajo":
            result = { value: stats.stockBajo.cantidad, subValue: stats.stockBajo.ordenado };
            break;
          default:
            throw new Error(`Unknown title: ${title}`);
        }

        setData(result);
      } catch (error) {
        console.error(`Error fetching data for ${title}:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [title]);

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (!data) {
    return <div className="text-red-500">Error loading data</div>;
  }

  return (
    <div className="flex flex-col rounded-lg p-6 bg-white">
      <h3 className={`text-xl font-bold ${colorClass}`}>{title}</h3>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xl font-bold text-gray-600">{data.value}</p>
        {data.subValue !== undefined && (
          <p className="text-xl font-bold text-gray-900">{data.subValue}</p>
        )}
      </div>
      <div className="flex justify-between items-center mt-1">
        <p className="text-sm text-gray-400">Cantidad</p>
        {data.subValue !== undefined && (
          <p className="text-sm text-gray-400">Ordenado</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;