import { GetServerSidePropsContext } from 'next'; 

import { ColorForm } from '../../../../components/colors/colorIdComponents/color-form'
import prismadb from '../../../../lib/prismadb'
import { ColorProps } from '../../../../types'

interface ColorPageProps {
  color: ColorProps | null;
}

export default function ColorPage({ color }: ColorPageProps){
  return(
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorForm initialData={color} />
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const colorId = context.params?.colorId as string | undefined; 

  try {
    const color = await prismadb.color.findUnique({
      where: {
        id: colorId
      }
    });

    if (!color) {
      return {
        props: {
          color: null,
        }
      };
    }

    return {
      props: {
        color: JSON.parse(JSON.stringify(color)),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        color: null,
      }
    };
  }
}
