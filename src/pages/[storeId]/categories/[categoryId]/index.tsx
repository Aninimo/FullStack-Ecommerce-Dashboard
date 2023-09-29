import { GetServerSidePropsContext } from 'next';
import { PrismaClient } from '@prisma/client';

import { CategoryForm } from '../../../../components/categories/categoryIdComponents/category-form';
import prismadb from '../../../../lib/prismadb';
import { BillboardProps, CategoryProps } from '../../../../types'

const prisma = new PrismaClient()

interface CategoryPageProps {
  category: CategoryProps | null;
  billboards: BillboardProps[] | null;
}

export default function CategoryPage({ 
  category, 
  billboards
}: CategoryPageProps) {
  if (billboards === null) {
    return <div>Loading...</div>; 
  }
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) { 
  const storeId = context.params?.storeId as string;
  const categoryId = context.params?.categoryId as string;

  try {
    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: storeId,
      },
    });

    if (!categoryId || !/^[0-9a-fA-F]{24}$/.test(categoryId)) {
      return {
        props: {
          billboards: JSON.parse(JSON.stringify(billboards)),
          category: null,
        },
      };
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    return {
      props: {
        billboards: JSON.parse(JSON.stringify(billboards)),
        category: JSON.parse(JSON.stringify(category)),
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      props: {
        billboards: null,
        category: null,
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}
