import { GetServerSideProps } from 'next';
import { format } from 'date-fns';
import { SizeColumn } from '../../../components/sizes/sizesComponents/columns';
import { SizesClient } from '../../../components/sizes/sizesComponents/client';
import prismadb from '../../../lib/prismadb';
import { SizeProps } from '../../../types';

type SizesPageProps = {
  result: SizeProps[];
}

export default function SizesPage(props: SizesPageProps) {
  const sizes = props.result;

  const formattedSizes: SizeColumn[] = sizes.map((item) => {
    const date = new Date(item.createdAt); 

    return {
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(date, 'MMMM do, yyyy'),
    };
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const storeId = context.params?.storeId as string | undefined; 

  if (!storeId) {
    return {
      notFound: true,
    };
  }

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: {
      result: JSON.parse(JSON.stringify(sizes)),
    },
  };
}
