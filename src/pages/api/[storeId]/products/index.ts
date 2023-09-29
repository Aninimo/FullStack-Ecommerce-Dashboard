import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import prismadb from '../../../../lib/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = getAuth(req);

    if (req.method === 'POST') {
      const { body } = req

      const {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images,
        isFeatured,
        isArchived,
      } = body;

      if (!userId) {
        return res.status(403).json({ error: "Unauthenticated" });
      }

      const priceAsString = price.toFixed(2)

      const product = await prismadb.product.create({
        data: {
          name,
          price: priceAsString,
          isFeatured,
          isArchived,
          categoryId,
          colorId,
          sizeId,
          storeId: req.query.storeId as string,
          images: {
            createMany: {
              data: [
                ...images.map((image: { url: string }) => image),
              ],
            },
          },
        },
      });

      return res.status(200).json(product);
    } else if (req.method === 'GET') {
      const { categoryId, colorId, sizeId, isFeatured } = req.query;

      if (!req.query.storeId) {
        return res.status(400).json({ error: "Store id is required" });
      }

      const products = await prismadb.product.findMany({
        where: {
          storeId: req.query.storeId as string,
          categoryId: categoryId as string | undefined,
          colorId: colorId as string | undefined,
          sizeId: sizeId as string | undefined,
          isFeatured: isFeatured === 'true' ? true : undefined,
          isArchived: false,
        },
        include: {
          images: true,
          category: true,
          color: true,
          size: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(products);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.log('[PRODUCTS_API]', error);
    return res.status(500).json({ error: "Internal error" });
  }
}
