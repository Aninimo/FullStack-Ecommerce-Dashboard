import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { SizeForm } from '../../../../components/sizes/sizeIdComponents/size-form'
import prismadb from '../../../../lib/prismadb'

interface SizePageProps {
  size: any; 
}

export default function SizePage(props: SizePageProps) {
  const size = props.size

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeForm initialData={size} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<SizePageProps> = async (context: GetServerSidePropsContext) => {
  const sizeId = context.params?.sizeId as string | undefined;

  if (!sizeId) {
    return {
      props: {
        size: null,
      },
    };
  }
  
  try {
    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId
      }
    });

    if (!size) {
      return {
        props: {
          size: null,
        }
      };
    }

    return {
      props: {
        size: JSON.parse(JSON.stringify(size)),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        size: null,
      }
    }
  }
}
