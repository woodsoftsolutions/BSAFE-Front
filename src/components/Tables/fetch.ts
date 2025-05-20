import * as logos from "@/assets/logos";

export async function getProveedores() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      nombre: "Compañia redes C.A.",
      producto: "Electronicos",
      correo: "correo@bsafe.com",
      telefono: "02125568922",
    },
    {
      nombre: "Compañia redes 2 C.A.",
      producto: "Electronicos",
      correo: "correo@bsafe.com",
      telefono: "02125568922",
    },
    {
      nombre: "Compañia redes 3 C.A.",
      producto: "Electronicos",
      correo: "correo@bsafe.com",
      telefono: "02125568922",
    },
    {
      nombre: "Compañia redes 4 C.A.",
      producto: "Electronicos",
      correo: "correo@bsafe.com",
      telefono: "02125568922",
    },
  ];
}


export async function getUsuarios() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      usuario: "admin1",
      estado: "Administrador",
      correo: "correo@bsafe.com",
      telefono: "02125568922",
    },
    {
      usuario: "pedroPerez",
      estado: "Analista",
      correo: "correo@bsafe.com",
      telefono: "02125568922",
    },
    {
      usuario: "user3",
      estado: "Analista1",
      correo: "correo@bsafe.com",
      telefono: "02125568922",
    },
    {
      usuario: "user4",
      estado: "Analista2",
      correo: "correo@bsafe.com",
      telefono: "02125568922",
    },
  ];
}

export async function getClientes() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      cliente: "Inversiones ventas C.A.",
      documento: "J-12345678-9",
      direccion: "Av Panteon, Galpon 1",
      correo: "correo@bsafe.com",
      telefono: "02125568922",
    },
    {
      cliente: "Inversiones ventas2 C.A.",
      documento: "J-12345678-9",
      direccion: "Av Panteon, Galpon 1",
      correo: "correo@bsafe.com",
      telefono: "02125568922",
    },
    {
      cliente: "Inversiones ventas3 C.A.",
      documento: "J-12345678-9",
      direccion: "Av Panteon, Galpon 1",
      correo: "correo@bsafe.com",
      telefono: "02125568922",
    },
    {
      cliente: "Inversiones ventas4 C.A.",
      documento: "J-12345678-9",
      direccion: "Av Panteon, Galpon 1",
      correo: "correo@bsafe.com",
      telefono: "02125568922",
    },
  ];
}

export async function getProductos() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      codigo: "TP-123456",
      descripcion: "Router WiFi 700Mbps",
      marca: "TP-Link",
      categoria: "Red",
      cantidad: 0,
    },
    {
      codigo: "TP-1234561",
      descripcion: "Router WiFi 700Mbps",
      marca: "TP-Link",
      categoria: "Red",
      cantidad: 10,
    },
    {
      codigo: "TP-1234562",
      descripcion: "Router WiFi 700Mbps",
      marca: "TP-Link",
      categoria: "Red",
      cantidad: 15,
    },
    {
      codigo: "TP-1234563",
      descripcion: "Router WiFi 700Mbps",
      marca: "TP-Link",
      categoria: "Red",
      cantidad: 25,
    },
  ];
}

export async function getInventario() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      nombre: "Access Point TP-Link",
      tipo: "Red",
      minimo: 15,
      precio: "200",
      cantidad: 0,
    },
    {
      nombre: "Access Point TP-Link 2",
      tipo: "Red",
      minimo: 15,
      precio: "200",
      cantidad: 10,
    },
    {
      nombre: "Access Point TP-Link 3",
      tipo: "Red",
      minimo: 15,
      precio: "200",
      cantidad: 20,
    },
    {
      nombre: "Access Point TP-Link 4",
      tipo: "Red",
      minimo: 15,
      precio: "200",
      cantidad: 30,
    },
  ];
}

export async function getCotizacion() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      cliente: "Inersiones C.A.",
      fecha: "17/03/2025",
      costo: 1500,
      estatus: "Aprobada",
    },
    {
      cliente: "Inersiones 2 C.A.",
      fecha: "16/03/2025",
      costo: 1500,
      estatus: "Pendiente",
    },
    {
      cliente: "Inersiones 3 C.A.",
      fecha: "18/03/2025",
      costo: 1500,
      estatus: "Rechazada",
    },
    {
      cliente: "Inersiones 4 C.A.",
      fecha: "19/03/2025",
      costo: 1500,
      estatus: "Aprobada",
    },
  ];
}

export async function getInvoiceTableData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return [
    {
      name: "Free package",
      price: 0.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Business Package",
      price: 99.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Unpaid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Pending",
    },
  ];
}

export async function getTopChannels() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      name: "Google",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.google,
    },
    {
      name: "X.com",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.x,
    },
    {
      name: "Github",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.github,
    },
    {
      name: "Vimeo",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.vimeo,
    },
    {
      name: "Facebook",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.facebook,
    },
  ];
}
