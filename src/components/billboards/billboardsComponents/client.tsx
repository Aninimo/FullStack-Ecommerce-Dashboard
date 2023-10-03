import { useRouter } from 'next/router'
import { Plus } from 'lucide-react'

import { Heading } from '../../ui/heading'
import { Button } from '../../ui/button'
import { Separator } from '../../ui/separator'
import { DataTable } from '../../ui/data-table'
import { ApiList } from '../../ui/api-list'

import { columns, BillboardColumn } from './columns'

interface BillboardClientProps {
  data: BillboardColumn[];
}

export function BillboardClient({
  data
}: BillboardClientProps){
  const router = useRouter()
  const params = router.query
  return(
    <>
      <div className='flex items-center justify-between'>
        <Heading title={`Billboards (${data.length})`} description='Manage billboards for your store'/>
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className='mr-2 h-4 w-4'/> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='label' columns={columns} data={data} />
      <Heading title='API' description='API Calls for Billboards'/>
      <Separator />
      <ApiList entityName='billboards' entityIdName='billboardId' />
    </>
  )
}
