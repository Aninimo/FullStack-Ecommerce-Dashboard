import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, RequireAuthProp} from '@clerk/nextjs/api'

import prismadb from '../../../../lib/prismadb';

export default requireAuth(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse
)  => {
  try {
    if (method === 'GET') {
      const productId = Array.isArray(req.query.productId)
      ? req.query.productId[0] 
      : req.query.productId as string;


      if (!productId) {
        return res.status(400).json({ error: "Product id is required" });
      }

      const product = await prismadb.product.findUnique({
        where: {
          id: productId
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
      const { userId } = req.auth;

      const productId = Array.isArray(req.query.productId)
      ? req.query.productId[0] 
      : req.query.productId as string;

      const storeId = Array.isArray(req.query.storeId)
      ? req.query.storeId[0] 
      : req.query.storeId as string;

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
          id: productId
        },
      });

      return res.status(200).json(product);
    } else if (method === 'PATCH') {
      const { userId } = req.auth;

      const { body } = req
      const { name, price, categoryId, images, colorId, sizeId, isFeatured, isArchived } = body;

      const productId = Array.isArray(req.query.productId)
      ? req.query.productId[0] 
      : req.query.productId as string;

      const storeId = Array.isArray(req.query.storeId)
      ? req.query.storeId[0] 
      : req.query.storeId as string;

      if (!userId) {
        return res.status(403).json({ error: "Unauthenticated" });
      }

      if (!productId) {
        return res.status(400).json({ error: "Product id is required" });
      }

      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: storeId,
          userId
        }
      });

      if (!storeByUserId) {
        return res.status(405).json({ error: "Unauthorized" });
      }

      const priceAsString = price.toFixed(2)

      await prismadb.product.update({
        where: {
          id: productId
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
          id: productId 
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
})
