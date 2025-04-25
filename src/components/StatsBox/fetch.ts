export interface StatsData {
    categorias: number;
    totalProducts: number;
    sinStock: { cantidad: number; ordenado: number };
    stockBajo: { cantidad: number; ordenado: number };
    cotizaciones: number;
    cotAprobadas: number;
    cotPendientes: number;
    cotRechazadas: number;
  }
  
// testing
const mockStatsData: StatsData = {
    categorias: 14,
    totalProducts: 868,
    sinStock: { cantidad: 5, ordenado: 5 },
    stockBajo: { cantidad: 12, ordenado: 2 },
    cotizaciones: 324,
    cotAprobadas: 256,
    cotPendientes: 50,
    cotRechazadas: 18,
  };
  
  export const fetchStats = async (): Promise<StatsData> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStatsData), 500); // 500ms delay
    });
  };



//   export const fetchStats = async (): Promise<StatsData> => {
//     const response = await fetch("/api/stats"); // reemplazar
//     if (!response.ok) {
//       throw new Error("Failed to fetch stats data");
//     }
//     return response.json();
//   };