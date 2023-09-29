import { Heading } from '../../ui/heading'
import { Separator } from '../../ui/separator'
import { DataTable } from '../../ui/data-table'

import { columns, OrderColumn } from './columns'

interface OrderClientProps {
  data: OrderColumn[];
}

export function OrderClient({
  data
}: OrderClientProps){
  return (
    <>
      <Heading title={`Orders (${data.length})`} description='Manage orders for your store' />
      <Separator />
      <DataTable searchKey='products' columns={columns} data={data} />
    </>
  );
}
