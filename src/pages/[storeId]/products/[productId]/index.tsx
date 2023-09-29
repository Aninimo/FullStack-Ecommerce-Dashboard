import { GetServerSidePropsContext } from 'next';
import { PrismaClient } from '@prisma/client';

import { ProductForm } from '../../../../components/products/productIdComponents/product-form';
import prismadb from '../../../../lib/prismadb';
import {
  CategoryProps,
  ColorProps,
  SizeProps,
  ProductProps,
  ImageProps,
} from '../../../../types';

const prisma = new PrismaClient();

export default function ProductPage({
  categories,
  colors,
  sizes,
  product,
}: {
  categories: CategoryProps[];
  colors: ColorProps[];
  sizes: SizeProps[];
  product: ProductProps & { images: ImageProps[] }; 
}) {
  const initialData = product?.images ? product : null;
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductForm
          categories={categories}
          colors={colors}
          sizes={sizes}
          initialData={initialData}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const storeId = context.params?.storeId as string;
  const productId = context.params?.productId as string; 

  try {
    const colors = await prismadb.color.findMany({
      where: {
        storeId: storeId,
      },
    });

    const categories = await prismadb.category.findMany({
      where: {
        storeId: storeId,
      },
    });

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: storeId,
      },
    });

    if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
      return {
        props: {
          product: null,
          colors: JSON.parse(JSON.stringify(colors)),
          categories: JSON.parse(JSON.stringify(categories)),
          sizes: JSON.parse(JSON.stringify(sizes)),
        },
      };
    }

    const product = (await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
      },
    })) as ProductProps & { images: ImageProps[] }; 

    if (!product.images || !Array.isArray(product.images)) {
      product.images = [];
    }

    return {
      props: {
        colors: JSON.parse(JSON.stringify(colors)),
        categories: JSON.parse(JSON.stringify(categories)),
        sizes: JSON.parse(JSON.stringify(sizes)),
        product: JSON.parse(JSON.stringify(product)),
      },
    };
  } catch (error) {
    console.error('Erro ao buscar dados:', error);

    return {
      props: {
        product: null,
        colors: null,
        categories: null, 
        sizes: null,
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}
