import { GetServerSidePropsContext } from 'next'
import { format } from 'date-fns'

import { OrderColumn } from '../../../../components/orders/ordersComponents/columns'
import { OrderClient } from '../../../../components/orders/ordersComponents/client'
import prismadb from '../../../../lib/prismadb'
import { formatter } from '../../../../lib/utils'
import { OrderProps, OrderItemProps } from '../../../../types'

interface OrdersPageProps {
  result: OrderProps[]; 
}

export default function OrdersPage(props: OrdersPageProps){
  const orders = props.result

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
      return total + Number(item.product.price)
    }, 0)),
    isPaid: item.isPaid,
    createdAt: format(new Date(item.createdAt), 'MMMM do, yyyy'),
}));

  
  return(
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const storeId = context.params?.storeId;

  const orders = await prismadb.order.findMany({
    where: {
      storeId: storeId as string,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: {
      result: JSON.parse(JSON.stringify(orders)),
    },
  };
};
