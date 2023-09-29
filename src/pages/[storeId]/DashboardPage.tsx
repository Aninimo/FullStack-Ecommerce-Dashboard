import { CreditCard, DollarSign, Package } from 'lucide-react'

import { Heading } from '../../../components/ui/heading'
import { Separator } from '../../../components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Overview } from '../../../components/overview'
import { formatter } from '../../../lib/utils'

export default function DashboardPage({
  totalRevenue,
  salesCount,
  stockCount,
  graphRevenue
}: {
  totalRevenue: number;
  salesCount: number;
  stockCount: number;
  graphRevenue: any;
}){
  
  return(
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
       <Heading title='Dashboard' description='Overview of your store'/>
        <Separator />
        <div className='grid gap-4 grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Revenue
              </CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{formatter.format(totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Sales</CardTitle>
              <CreditCard className='h-4 w-4 text-muted-foreground'/>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>+{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Products In Stock</CardTitle>
              <Package className='h-4 w-4 text-muted-foreground'/>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
