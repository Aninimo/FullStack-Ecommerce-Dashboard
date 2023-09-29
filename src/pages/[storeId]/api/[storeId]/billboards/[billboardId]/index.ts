import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'

import prismadb from '../../../../../lib/prismadb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const billboardId = Array.isArray(req.query.billboardId) ? req.query.billboardId[0] : req.query.billboardId;

      if (!billboardId || typeof billboardId !== 'string') {
        throw new Error('Billboard id is required')
      }

      const billboard = await prismadb.billboard.findUnique({
        where: {
          id: billboardId
        }
      })

      return res.status(200).json(billboard)
    }

    if (req.method === 'DELETE') {
      const { userId } = getAuth(req)

      if (!userId) {
        throw new Error('Unauthenticated')
      }

      const billboardId = Array.isArray(req.query.billboardId) ? req.query.billboardId[0] : req.query.billboardId;
      const storeId = Array.isArray(req.query.storeId) ? req.query.storeId[0] : req.query.storeId;

      if (!billboardId || typeof billboardId !== 'string') {
        throw new Error('Billboard id is required')
      }

      if (!storeId || typeof storeId !== 'string') {
        throw new Error('Store id is required')
      }

      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: storeId,
          userId,
        }
      })

      if (!storeByUserId) {
        throw new Error('Unauthorized')
      }

      const billboard = await prismadb.billboard.delete({
        where: {
          id: billboardId,
        }
      })

      return res.status(200).json(billboard)
    }

    if (req.method === 'PATCH') {
      const { userId } = getAuth(req)

      const { body } = req
      const { label, imageUrl } = body

      if (!userId) {
        throw new Error('Unauthenticated')
      }

      if (!label) {
        throw new Error('Label is required')
      }

      if (!imageUrl) {
        throw new Error('Image URL is required')
      }

      const billboardId = Array.isArray(req.query.billboardId) ? req.query.billboardId[0] : req.query.billboardId;
      const storeId = Array.isArray(req.query.storeId) ? req.query.storeId[0] : req.query.storeId;

      if (!billboardId || typeof billboardId !== 'string') {
        throw new Error('Billboard id is required')
      }

      if (!storeId || typeof storeId !== 'string') {
        throw new Error('Store id is required')
      }

      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: storeId,
          userId,
        }
      })

      if (!storeByUserId) {
        throw new Error('Unauthorized')
      }

      const billboard = await prismadb.billboard.update({
        where: {
          id: billboardId
        },
        data: {
          label,
          imageUrl
        }
      })

      return res.status(200).json(billboard)
    }

    return res.status(405).end()
  } catch (error) {
    console.error(error)

    return res.status(500).end()
  }
}
