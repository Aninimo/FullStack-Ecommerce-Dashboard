import { format } from 'date-fns'

import { BillboardColumn } from '../../../components/billboards/billboardsComponents/columns'
import { BillboardClient } from '../../../components/billboards/billboardsComponents/client'
import prismadb from '../../../lib/prismadb'
import { BillboardProps } from '../../../types'

interface BillboardsPageProps {
  result: BillboardProps[];
}

export default function BillboardsPage(props: BillboardsPageProps){
  const billboards = props.result

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => {
    const dateWithoutMilliseconds = String(item.createdAt).split('.')[0]
    const date = new Date(dateWithoutMilliseconds)

    return {
      id: item.id,
      label: item.label,
      createdAt: format(date, 'MMMM do, yyyy'),
    };
  })
  
  return(
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient data={formattedBillboards}/>
      </div>
    </div>
  )
}

export async function getServerSideProps(context:{
  params: {
    storeId: string; 
  }
}) {
  const { storeId } = context.params
  
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return{
    props:{
      result: JSON.parse(JSON.stringify(billboards))
    }
  }
}
