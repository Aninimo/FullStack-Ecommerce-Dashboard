import { GetServerSidePropsContext } from 'next'
import { format } from 'date-fns'

import { ProductsClient } from '../../../components/products/productsComponents/client'
import { ProductColumn } from '../../../components/products/productsComponents/columns'
import prismadb from '../../../lib/prismadb'
import { formatter } from '../../../lib/utils'
import { ProductColumnProps } from '../../../types'

interface ProductsPageProps{
  result: ProductColumnProps[]
}

export default function ProductsPage(props: ProductsPageProps){
  const products = props.result
  
  const formattedProducts: ProductColumn[] = products.map((item) => {
    const dateWithoutMilliseconds = String(item.createdAt).split('.')[0]
    const date = new Date(dateWithoutMilliseconds)

    return {
      id: item.id,
      name: item.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price: formatter.format(parseFloat(item.price)),
      category: item.category?.name,
      size: item.size?.name,
      color: item.color?.value,
      createdAt: format(date, 'MMMM do, yyyy'),
    }
  })
  
  return(
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const storeId = context.params?.storeId;

  const products = await prismadb.product.findMany({
    where: {
      storeId: {
        equals: storeId as string, 
      }
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return{
    props:{
      result: JSON.parse(JSON.stringify(products)),
    }
  }
}
