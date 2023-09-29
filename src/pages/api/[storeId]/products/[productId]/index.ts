import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

import prismadb from '../../../../../lib/prismadb';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  const { method, query } = req;
  const { productId, storeId } = query;

  try {
    if (method === 'GET') {
      if (!productId) {
        return res.status(400).json({ error: "Product id is required" });
      }

      const product = await prismadb.product.findUnique({
        where: {
          id: productId as string
        },
        include: {
          images: true,
          category: true,
          size: true,
          color: true,
        }
      });

      return res.status(200).json(product);
    } else if (method === 'DELETE') {
      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(403).json({ error: "Unauthenticated" });
      }

      if (!productId) {
        return res.status(400).json({ error: "Product id is required" });
      }

      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: storeId as string,
          userId
        }
      });

      if (!storeByUserId) {
        return res.status(405).json({ error: "Unauthorized" });
      }

      const product = await prismadb.product.delete({
        where: {
          id: productId as string
        },
      });

      return res.status(200).json(product);
    } else if (method === 'PATCH') {
      const { userId } = getAuth(req);

      const { body } = req
      const { name, price, categoryId, images, colorId, sizeId, isFeatured, isArchived } = body;

      if (!userId) {
        return res.status(403).json({ error: "Unauthenticated" });
      }

      if (!productId) {
        return res.status(400).json({ error: "Product id is required" });
      }

      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: storeId as string,
          userId
        }
      });

      if (!storeByUserId) {
        return res.status(405).json({ error: "Unauthorized" });
      }

      const priceAsString = price.toFixed(2)

      await prismadb.product.update({
        where: {
          id: productId as string
        },
        data: {
          name,
          price: priceAsString,
          categoryId,
          colorId,
          sizeId,
          images: {
            deleteMany: {},
          },
          isFeatured,
          isArchived,
        },
      });

      const updatedProduct = await prismadb.product.update({
        where: {
          id: productId as string
        },
        data: {
          images: {
            createMany: {
              data: images,
            },
          },
        },
      });

      return res.status(200).json(updatedProduct);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error('[PRODUCT_API]', error);
    return res.status(500).json({ error: "Internal error" });
  }
}
