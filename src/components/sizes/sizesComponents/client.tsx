import { useRouter } from 'next/router'
import { Plus } from 'lucide-react'

import { ApiList } from '../../ui/api-list'
import { Heading } from '../../ui/heading'
import { Button } from '../../ui/button'
import { DataTable } from '../../ui/data-table'
import { Separator } from '../../ui/separator'
import { columns, SizeColumn } from './columns'

interface SizesClientProps {
  data: SizeColumn[];
}

export const SizesClient: React.FC<SizesClientProps> = ({
  data
}) => {
  const router = useRouter()
  const params = router.query

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={`Sizes (${data.length})`} description='Manage sizes for your products'/>
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className='mr-2 h-4 w-4'/> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
      <Heading title='API' description='API Calls for Sizes'/>
      <Separator />
      <ApiList entityName='sizes' entityIdName='sizeId'/>
    </>
  );
};
