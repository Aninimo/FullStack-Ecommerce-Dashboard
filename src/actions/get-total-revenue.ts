import prismadb from '../lib/prismadb'

export const getTotalRevenue = async (storeId: string): Promise<number> => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  const totalRevenue: number = paidOrders.reduce((total: number, order: any) => {
    const orderTotal: number = order.orderItems.reduce((orderSum: number, item: any) => {
      const itemPrice: number = parseFloat(item.product.price);
      return orderSum + itemPrice;
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
}
