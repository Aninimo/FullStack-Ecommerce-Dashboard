import { useRouter } from 'next/router'
import { Plus } from 'lucide-react'

import { Heading } from '../../ui/heading'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import { DataTable } from '../../components/ui/data-table'
import { ApiList } from '../../components/ui/api-list'

import { ProductColumn, columns } from './columns'

interface ProductsClientProps {
  data: ProductColumn[];
};

export function ProductsClient({
  data
}: ProductsClientProps){
  const router = useRouter()
  const params = router.query

  return (
    <> 
      <div className='flex items-center justify-between'>
        <Heading title={`Products (${data.length})`} description='Manage products for your store' />
        <Button onClick={() => router.push(`/${params.storeId}/routes/products/new`)}>
          <Plus className='mr-2 h-4 w-4'/> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
      <Heading title='API' description='API Calls for Products' />
      <Separator />
      <ApiList entityName='products' entityIdName='productId' />
    </>
  )
}
