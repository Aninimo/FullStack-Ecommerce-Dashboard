import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'

import prismadb from '../../../../lib/prismadb'

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  try{
    if(req.method === 'POST'){
      const { userId } = getAuth(req)

      const { body } = req
      const { name, billboardId } = body

      if (!userId) {
        throw new Error('Unauthenticated')
      }

      if (!name) {
        throw new Error('Name is required')
      }

      if (!billboardId) {
        throw new Error('Billboard ID is required')
      }

      const storeId = req.query.storeId as string | undefined;

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

      const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: storeId,
      }
    })
      
      return res.status(200).json(category)
    } 

    if (req.method === 'GET') {
      const storeId = req.query.storeId as string | undefined;

      if (!storeId) {
        throw new Error('Store id is required')
      }

      const categories = await prismadb.category.findMany({
       where: {
         storeId: storeId
       }
     })
      
      return res.status(200).json(categories)
    }
    return res.status(405).end()
  }catch (error) {
    console.log(error)

    return res.status(500).end()
  }
}
