import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, RequireAuthProp} from '@clerk/nextjs/api'

import prismadb from '../../../../lib/prismadb'

export default requireAuth(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse
)  => {
  try{
    if(req.method === 'POST'){
      const { userId } = req.auth
      
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

      const storeId = Array.isArray(req.query.storeId)
      ? req.query.storeId[0] 
      : req.query.storeId as string;

      if (!storeId) {
        throw new Error('Store id is required')
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

      const size = await prismadb.size.create({
        data: {
          name,
          value,
          storeId: storeId
        }
      })
      return res.status(200).json(size)
    } 

    if (req.method === 'GET') {
      const storeId = Array.isArray(req.query.storeId)
      ? req.query.storeId[0] 
      : req.query.storeId as string;

      if (!storeId) {
        throw new Error('Store id is required')
      }

      const sizes = await prismadb.size.findMany({
        where: {
          storeId: storeId
        }
      })
      return res.status(200).json(sizes)
    }
    return res.status(405).end()
  }catch (error) {
    console.log(error)

    return res.status(500).end()
  }
})
