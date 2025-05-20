import React, { useState, useEffect } from "react";

interface EditUserModalProps {
  user: any;
  onClose: () => void;
  onSuccess?: () => void;
}

const initialState = {
  first_name: "",
  last_name: "",
  dni: "",
  phone: "",
  email: "",
  position: "",
  hire_date: "",
  can_manage_inventory: false,
  active: false,
  password: "",
};

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSuccess }) => {
  const [form, setForm] = useState({ ...initialState });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || user.user?.name?.split(" ")[0] || "",
        last_name: user.last_name || user.user?.name?.split(" ")[1] || "",
        dni: user.dni || "",
        phone: user.phone || "",
        email: user.user?.email || user.email || "",
        position: user.position || "",
        hire_date: user.hire_date || "",
        can_manage_inventory: !!user.can_manage_inventory,
        active: !!user.active,
        password: "", // No mostrar la contraseña actual
      });
    }
  }, [user]);

  // Nuevo: ocultar header al abrir/cerrar modal
  useEffect(() => {
    const header = document.querySelector("header");
    if (user && header) {
      (header as HTMLElement).style.display = "none";
    } else if (!user && header) {
      (header as HTMLElement).style.display = "";
    }
    return () => {
      if (header) (header as HTMLElement).style.display = "";
    };
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const requiredFields = [
      "first_name",
      "last_name",
      "dni",
      "phone",
      "email",
      "position",
    ];
    for (const field of requiredFields) {
      if (!form[field as keyof typeof form]) {
        return `El campo ${field.replace("_", " ")} es requerido.`;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        hire_date: form.hire_date ? form.hire_date : null,
      };
      // PATCH para actualizar usuario
      const res = await fetch(`http://127.0.0.1:8000/api/employees/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        setSuccess("Usuario actualizado exitosamente");
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(result.message || "Error al actualizar usuario");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="mb-2 text-red-600">{error}</div>}
          {success && <div className="mb-2 text-green-600">{success}</div>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese el nombre"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Apellido</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese el apellido"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">DNI</label>
            <input
              type="text"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese el DNI"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese el teléfono"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese el correo electrónico"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cargo</label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese el cargo"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Contratación</label>
            <input
              type="date"
              name="hire_date"
              value={form.hire_date || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-4 flex items-center gap-4">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="can_manage_inventory"
                checked={form.can_manage_inventory}
                onChange={handleChange}
                className="mr-2"
              />
              Puede gestionar inventario
            </label>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="mr-2"
              />
              Activo
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña (dejar en blanco para no cambiar)</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#24726b] focus:border-[#24726b] dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese la nueva contraseña"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#99DFD8] hover:bg-[#24726b] text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
