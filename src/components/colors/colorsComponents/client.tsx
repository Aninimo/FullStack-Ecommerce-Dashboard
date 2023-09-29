import { useRouter } from 'next/router'
import { Plus } from 'lucide-react'

import { Heading } from '../../ui/heading'
import { Button } from '../../ui/button'
import { DataTable } from '../../ui/data-table'
import { Separator } from '../../ui/separator'
import { ApiList } from '../../ui/api-list'

import { columns, ColorColumn } from './columns'

interface ColorClientProps {
  data: ColorColumn[];
}

export function ColorClient({
  data
}: ColorClientProps){
  const router = useRouter()
  const params = router.query
  
  return(
    <>
      <div className='flex items-center justify-between'>
        <Heading title={`Colors (${data.length})`} description='Manage colors for your products'/>
        <Button onClick={() => router.push(`/${params.storeId}/routes/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
      <Heading title='API' description='API Calls for Colors' />
      <Separator />
      <ApiList entityName='colors' entityIdName='colorId'/>
    </>
  )
}
