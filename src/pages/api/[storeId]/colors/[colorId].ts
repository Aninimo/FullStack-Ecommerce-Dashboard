import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, RequireAuthProp} from '@clerk/nextjs/api'

import prismadb from '../../../../lib/prismadb'

export default requireAuth(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse
)  => {
  try{
    if (req.method === 'GET') {
      const colorId = req.query.colorId as string
      
      if (!colorId) {
        throw new Error('Color id is required')
      }

      const color = await prismadb.color.findUnique({
        where: {
          id: colorId
        }
      })
      
      return res.status(200).json(color)
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

    if(req.method === 'PATCH'){
      const { userId } = req.auth

      const { body } = req
      const { name, value } = body

      if (!userId) {
        throw new Error('Unauthenticated');
      }

      if (!name) {
        throw new Error('Name is required');
      }

      if (!value) {
        throw new Error('Value is required');
      }

      if (!colorId) {
        throw new Error('Color id is required');
      }

      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: storeId,
          userId
        }
      });

      if (!storeByUserId) {
        throw new Error('Unauthorized');
      }

      const color = await prismadb.color.update({
        where: {
          id: colorId
        },
        data: {
          name,
          value
        }
      });
  
      return res.status(200).json(color)
    }
    return res.status(405).end()
  }catch (error) {
    console.log(error)

    return res.status(500).end()
  }
})
