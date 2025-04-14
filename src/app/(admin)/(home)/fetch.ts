export async function getOverviewData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    proveedores: {
      value: 36,
      growthRate: 3,
    },
    productos: {
      value: 220,
      growthRate: -4.35,
    },
    cotizaciones: {
      value: 58,
      growthRate: 2.59,
    },
    usuarios: {
      value: 5,
      growthRate: 10,
    },
  };
}
