import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, RequireAuthProp} from '@clerk/nextjs/api'

import prismadb from '../../../../lib/prismadb'

export default requireAuth(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse
)  => {
  try {
    if (req.method === 'POST') {
      const { userId } = req.auth;
      
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

      const { storeId } = req.query

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

      const billboard = await prismadb.billboard.create({
        data: {
          label,
          imageUrl,
          storeId: storeId,
        }
      })

      return res.status(200).json(billboard)
    } 

    if (req.method === 'GET') {
      const { storeId } = req.query

      if (!storeId || typeof storeId !== 'string') {
        throw new Error('Store id is required')
      }

      const billboards = await prismadb.billboard.findMany({
        where: {
          storeId: storeId,
        }
      })
      
      return res.status(200).json(billboards)
    }

    return res.status(405).end()
  } catch (error) {
    console.error(error)

    return res.status(500).end()
  }
})
