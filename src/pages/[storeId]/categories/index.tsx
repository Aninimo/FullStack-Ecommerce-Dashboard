import { GetServerSidePropsContext } from 'next'
import { format } from 'date-fns'

import { CategoryColumn } from '../../../components/categories/categoriesComponents/columns'
import { CategoriesClient } from '.../../../components/categories/categoriesComponents/client'
import prismadb from '../../../lib/prismadb'
import { CategoryProps } from '../../../types'

interface CategoriesPageProps {
  result: CategoryProps[];
}

export default function CategoriesPage(props: CategoriesPageProps){
  const categories = props.result

  const formattedCategories: CategoryColumn[] = categories.map((item) => {
    const dateWithoutMilliseconds = String(item.createdAt).split('.')[0]
    const date = new Date(dateWithoutMilliseconds)

    return {
      id: item.id,
      name: item.name,
      billboardLabel: item.billboard.label,
      createdAt: format(date, 'MMMM do, yyyy')
    };
  })
  
  return(
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const storeId = context.params?.storeId;

  if (!storeId) {
    return {
      notFound: true,
    };
  }

  const categories = await prismadb.category.findMany({
    where: {
      storeId: {
        equals: storeId as string, 
      }
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return{
    props:{
      result: JSON.parse(JSON.stringify(categories)),
    }
  }
}
