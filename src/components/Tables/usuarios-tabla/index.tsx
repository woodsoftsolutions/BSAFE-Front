"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { TrashIcon, PencilSquareIcon, EyeIcon } from "@/assets/icons";
import UserDetailsModal from "@/components/Modals/UserDetailsModal";
import EditUserModal from "@/components/Modals/EditUserModal";
import { API_BASE_URL } from "@/lib/constants";

export function UsuariosTabla() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Refactor: fetchData como función reutilizable
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees`);
      const json = await res.json();
      setData(json.data || []);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler para refrescar datos tras edición
  const handleEditSuccess = () => {
    fetchData();
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
              Usuario
            </TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="text-right xl:pr-7.5">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Cargando...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Sin datos
              </TableCell>
            </TableRow>
          ) : (
            data.map((usuario: any) => (
              <TableRow
                className="text-base font-medium text-dark dark:text-white"
                key={usuario.id}
              >
                <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                  <div>{usuario.user?.name || "-"}</div>
                </TableCell>
                <TableCell>{usuario.user?.email || "-"}</TableCell>
                <TableCell>{usuario.position || "-"}</TableCell>
                <TableCell>{usuario.phone || "-"}</TableCell>
                <TableCell className="xl:pr-7.5">
                  <div className="flex items-center justify-end gap-x-3.5">
                    <button
                      className="hover:text-primary"
                      onClick={() => {
                        setSelectedUser(usuario);
                        setShowDetails(true);
                      }}
                    >
                      <span className="sr-only">Detalles</span>
                      <EyeIcon />
                    </button>
                    <button
                      className="hover:text-primary"
                      onClick={() => {
                        setSelectedUser(usuario);
                        setShowEdit(true);
                      }}
                    >
                      <span className="sr-only">Editar</span>
                      <PencilSquareIcon />
                    </button>
                    <button className="hover:text-primary">
                      <span className="sr-only">Eliminar</span>
                      <TrashIcon />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {showDetails && (
        <UserDetailsModal user={selectedUser} onClose={() => setShowDetails(false)} />
      )}
      {showEdit && (
        <EditUserModal user={selectedUser} onClose={() => setShowEdit(false)} onSuccess={handleEditSuccess} />
      )}
    </div>
  );
}
