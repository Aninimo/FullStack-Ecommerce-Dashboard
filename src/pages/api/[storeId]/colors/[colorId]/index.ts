import { NextApiRequest, NextApiResponse } from 'next'
import { withServerSideAuth } from '@clerk/nextjs/ssr'

import prismadb from '../../../../../lib/prismadb'

export default withServerSideAuth(async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  try{
    if(req.method === 'POST'){
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

      const { storeId } = req.query

      if (!storeId) {
        throw new Error('Store id is required')
      }

      const storeIdStr = Array.isArray(storeId) ? storeId[0] : storeId;

      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: storeIdStr,
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
          storeId: storeIdStr
        }
      })
      
      return res.status(200).json(color)
    } 

    if (req.method === 'GET') {
      const { storeId } = req.query

      if (!storeId) {
        throw new Error('Store id is required')
      }

      const storeIdStr = Array.isArray(storeId) ? storeId[0] : storeId as string;

      const colors = await prismadb.color.findMany({
        where: {
          storeId: storeIdStr
        }
      })
      
      return res.status(200).json(colors)
    }
    return res.status(405).end()
  }catch (error) {
    console.log(error)

    return res.status(500).end()
  }
})
