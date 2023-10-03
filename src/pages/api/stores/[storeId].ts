import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, RequireAuthProp} from '@clerk/nextjs/api'

import prismadb from '../../../lib/prismadb'

export default requireAuth(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse
)  => {
  try {
    if (req.method === 'PATCH') {
      const { userId } = req.auth;
      const { body } = req
      const { name } = body

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      if (!name) {
        return res.status(400).json({ error: 'Name is required' })
      }

      const { storeId } = req.query;

      if (!storeId) {
        return res.status(400).json({
          error: 'Store id is required'
        })
      }

      const store = await prismadb.store.updateMany({
        where: {
          id: storeId as string,
          userId,
        },
        data: {
          name,
        },
      });

      return res.status(200).json(store);
    }

    if (req.method === 'DELETE') {
      const { userId } = req.auth;
      const { storeId } = req.query

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      if (!storeId) {
        return res.status(400).json({ error: 'Store id is required' })
      }

      const deletedStore = await prismadb.store.deleteMany({
        where: {
          id: storeId as string,
          userId,
        },
      });
      
      if (!deletedStore) {
        return res.status(404).json({ error: 'Store not found' })
      }

      return res.status(200).json({ message: 'Store deleted successfully' });
    }

    return res.status(405).end();
  } catch (error) {
    console.error(error);

    return res.status(500).end();
  }
})
