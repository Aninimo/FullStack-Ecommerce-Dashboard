import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, RequireAuthProp} from '@clerk/nextjs/api'

import prismadb from '../../../../lib/prismadb'

export default requireAuth(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse
)  => {
  try {
    if (req.method === 'GET') {
      const categoryId = Array.isArray(req.query.categoryId) ? req.query.categoryId[0] : req.query.categoryId as string;
      
      if (!categoryId) {
        throw new Error('category id is required')
      }

      const category = await prismadb.category.findUnique({
        where: {
          id: categoryId
        },
        include: {
          billboard: true
        }
      })

      return res.status(200).json(category)
    }

    if (req.method === 'DELETE') {
      const { userId } = req.auth
      
      if (!userId) {
        throw new Error('Unauthenticated')
      }

     const categoryId = req.query.categoryId as string;
     const storeId = req.query.storeId as string;


    if (!categoryId) {
      throw new Error('category id is required')
    }

    const storeByUserId = await prismadb.store.findFirst({
     where: {
      id: storeId,
      userId
     }
   })

      if (!storeByUserId) {
        throw new Error('Unauthorized')
      }

      const category = await prismadb.category.delete({
        where: {
          id: categoryId,
        }
      })
      
      return res.status(200).json(category)
    }

    if (req.method === 'PATCH') {
      const { userId } = req.auth
      
      const { body } = req
      const { name, billboardId } = body

      if (!userId) {
        throw new Error('Unauthenticated')
      }

      if (!billboardId) {
        throw new Error('Billboard ID is required')
      }

      if (!name) {
        throw new Error('Name is required')
      }

      const categoryId = req.query.categoryId as string;
      const storeId = req.query.storeId as string;

      if (!categoryId) {
        throw new Error('Category id is required')
      }

      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: storeId,
          userId
        }
      })

      if (!storeByUserId) {
        throw new Error('Unauthorized')
      }

      const category = await prismadb.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name,
          billboardId
        }
      })

      return res.status(200).json(category)
    }

    return res.status(405).end()
  } catch (error) {
    console.error(error)

    return res.status(500).end()
  }
})
