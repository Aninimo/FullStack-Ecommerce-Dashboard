import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, RequireAuthProp} from '@clerk/nextjs/api'

import prismadb from '../../../../..lib/prismadb'

export default requireAuth(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse
)  => {
  try {
    if (req.method === 'GET') {
      const sizeId = Array.isArray(req.query.sizeId)
      ? req.query.sizeId[0] 
      : req.query.sizeId as string;

      if (!sizeId) {
        throw new Error('Size id is required')
      }

      const size = await prismadb.size.findUnique({
        where: {
          id: sizeId
        }
      })

      return res.status(200).json(size)
    }

    if (req.method === 'DELETE') {
      const { userId } = req.auth;

      if (!userId) {
        throw new Error('Unauthenticated')
      }

      const sizeId = Array.isArray(req.query.sizeId)
      ? req.query.sizeId[0] 
      : req.query.sizeId as string; 

      const storeId = Array.isArray(req.query.storeId)
      ? req.query.storeId[0] 
      : req.query.storeId as string; 

      if (!sizeId) {
        throw new Error('Size id is required')
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

      const size = await prismadb.size.delete({
        where: {
          id: sizeId
        }
      })
      return res.status(200).json(size)
    }

    if (req.method === 'PATCH') {
      const { userId } = req.auth;

      const { body } = req
      const { name, value } = body

      if (!userId) {
        throw new Error('Unauthenticated')
      }

      if (!name) {
        throw new Error('Name is required')
      }

      if (!value) {
        throw new Error('Value is required')
      }

      const sizeId = Array.isArray(req.query.sizeId)
      ? req.query.sizeId[0] 
     : req.query.sizeId as string; 
      
     const storeId = Array.isArray(req.query.storeId)
     ? req.query.storeId[0] 
     : req.query.storeId as string; 
      
      if (!sizeId) {
        throw new Error('Size id is required')
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

      const size = await prismadb.size.update({
        where: {
          id: sizeId
        },
        data: {
          name,
          value
        }
      })

      return res.status(200).json(size)
    }

    return res.status(405).end()
  } catch (error) {
    console.error(error)

    return res.status(500).end()
  }
})
