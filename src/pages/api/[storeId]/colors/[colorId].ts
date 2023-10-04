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

      const storeId = req.query.storeId as string;

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

      const color = await prismadb.color.create({
        data: {
          name,
          value,
          storeId: storeId
        }
      })
      
      return res.status(200).json(color)
    } 

    if (req.method === 'GET') {
      const storeId = req.query.storeId as string;

      if (!storeId) {
        throw new Error('Store id is required')
      }

      const colors = await prismadb.color.findMany({
        where: {
          storeId: storeId
        }
      })
      
      return res.status(200).json(colors)
    }

    if (req.method === 'DELETE') {
      const { userId } = req.auth
      
      if (!userId) {
        throw new Error('Unauthenticated')
      }

     const colorId = req.query.colorId as string;
     const storeId = req.query.storeId as string;


    if (!colorId) {
      throw new Error('color id is required')
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

     if (!storeByUserId) {
       throw new Error('Unauthorized')
     }

     const color = await prismadb.color.delete({
       where: {
         id: colorId
       }
     })
      
      return res.status(200).json(color)
    }
    return res.status(405).end()
  }catch (error) {
    console.log(error)

    return res.status(500).end()
  }
})
