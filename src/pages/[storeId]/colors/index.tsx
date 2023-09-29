import { GetServerSidePropsContext } from 'next'
import { format } from 'date-fns'

import { ColorColumn } from '../../../../components/colors/colorsComponents/columns'
import { ColorClient } from '../../../../components/colors/colorsComponents/client'
import prismadb from '../../../../lib/prismadb'
import { ColorProps } from '../../../../types'

interface ColorsPageProps{
  result: ColorProps[];
}

export default function ColorsPage(props: ColorsPageProps){
  const colors = props.result

  const formattedColors: ColorColumn[] = colors.map((item) => {
    const dateWithoutMilliseconds = String(item.createdAt).split('.')[0]
    const date = new Date(dateWithoutMilliseconds)

    return {
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(date, 'MMMM do, yyyy'),
    };
  })

  return(
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorClient data={formattedColors}/>
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
  
  const colors = await prismadb.color.findMany({
    where: {
      storeId: {
        equals: storeId as string, 
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return{
    props:{
      result: JSON.parse(JSON.stringify(colors)),
    }
  }
}
