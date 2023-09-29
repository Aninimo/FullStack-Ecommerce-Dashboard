import { useRouter } from 'next/router'
import { Plus } from 'lucide-react'

import { Heading } from '../../ui/heading'
import { Button } from '../../ui/button'
import { Separator } from '../../ui/separator'
import { DataTable } from '../../ui/data-table'
import { ApiList } from '../../ui/api-list'
import { ApiAlert } from '../../ui/api-alert'

import { columns, CategoryColumn } from './columns'

interface CategoriesClientProps {
  data: CategoryColumn[];
}

export const CategoriesClient: React.FC<CategoriesClientProps> = ({
  data
}) => {
  const router = useRouter()
  const params = router.query
  
  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={`Categories (${data.length})`} description='Manage categories for your store'/>
        <Button onClick={() => router.push(`/${params.storeId}/routes/categories/new`)}>
          <Plus className='mr-2 h-4 w-4'/> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
      <Heading title='API' description='API Calls for Categories' />
      <Separator />
      <ApiList entityName='categories' entityIdName='categoryId'/>
    </>
  );
}
