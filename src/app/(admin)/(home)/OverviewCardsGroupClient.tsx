import { FaUsers, FaBox, FaFileAlt, FaUserCheck } from "react-icons/fa";

export function OverviewCardsGroupClient({ summary, loading }: { summary: any, loading: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div className="rounded-lg bg-white p-4 shadow-xl dark:bg-gray-dark dark:shadow-card text-center">
        <div className="flex justify-center mb-2"><FaUsers className="text-3xl text-blue-600" /></div>
        <div className="text-2xl font-bold text-blue-600">
          {loading ? '...' : summary?.suppliers_count ?? '-'}
        </div>
        <div className="text-gray-700 dark:text-gray-200 mt-2">Proveedores registrados</div>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-xl dark:bg-gray-dark dark:shadow-card text-center">
        <div className="flex justify-center mb-2"><FaBox className="text-3xl text-green-600" /></div>
        <div className="text-2xl font-bold text-green-600">
          {loading ? '...' : summary?.products_count ?? '-'}
        </div>
        <div className="text-gray-700 dark:text-gray-200 mt-2">Productos registrados</div>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-xl dark:bg-gray-dark dark:shadow-card text-center">
        <div className="flex justify-center mb-2"><FaFileAlt className="text-3xl text-yellow-600" /></div>
        <div className="text-2xl font-bold text-yellow-600">
          {loading ? '...' : summary?.pending_quotations ?? '-'}
        </div>
        <div className="text-gray-700 dark:text-gray-200 mt-2">Cotizaciones pendientes</div>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-xl dark:bg-gray-dark dark:shadow-card text-center">
        <div className="flex justify-center mb-2"><FaUserCheck className="text-3xl text-purple-600" /></div>
        <div className="text-2xl font-bold text-purple-600">
          {loading ? '...' : summary?.active_users ?? '-'}
        </div>
        <div className="text-gray-700 dark:text-gray-200 mt-2">Usuarios activos</div>
      </div>
    </div>
  );
}
