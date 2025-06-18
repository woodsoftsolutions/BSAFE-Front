// Utilidad para obtener el balance de inventario por producto
export function getInventoryBalanceForProduct(balances: any[], productId: number|string): number {
  if (!Array.isArray(balances)) return 0;
  const found = balances.find(b => b.product_id === productId);
  return found ? Number(found.quantity) : 0;
}
