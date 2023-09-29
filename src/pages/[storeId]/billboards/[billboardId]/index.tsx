import { GetServerSidePropsContext } from 'next';
import { BillboardForm } from '../../../../components/billboards/billboardComponentsId/billboard-form';

import prismadb from '../../../../lib/prismadb';

type BillboardsPageProps = {
  billboard: any; 
};

export default function BillboardsPage(props: BillboardsPageProps) {
  const billboard = props.billboard;

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { billboardId } = context.params as { billboardId: string };

  try {
    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId
      }
    });

    if (!billboard) {
      return {
        props: {
          billboard: null
        }
      };
    }

    return {
      props: {
        billboard: JSON.parse(JSON.stringify(billboard)),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        billboard: null,
      }
    };
  }
}
