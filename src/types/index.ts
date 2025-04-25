// Definición de tipos relacionados con inventario
export interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    categoria: string;
    precio: number;
    stock: number;
    tipo: string;
    stockMinimo: number;
    fechaActualizacion?: Date;
  }

  export interface SortConfig {
    key: keyof Producto;
    direction: 'ascending' | 'descending';
  }
  
  // Tipos para las props de los componentes
  export interface InventarioTablaProps {
    searchTerm?: string;
    sortConfig?: { key: keyof Producto; direction: 'ascending' | 'descending' } | null;
    selectedCategory?: string;
    onSort?: (key: keyof Producto) => void;
    getFilteredAndSortedData?: (data: Producto[]) => Producto[];
  }
  
  // Puedes añadir más tipos aquí según necesites
  export interface Categoria {
    id: string;
    nombre: string;
  }