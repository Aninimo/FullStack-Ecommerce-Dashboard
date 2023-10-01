import { NextApiRequest, NextApiResponse } from 'next'
import { withServerSideAuth } from '@clerk/nextjs/ssr'

import prismadb from '../../../lib/prismadb'

const middleware = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return handler(req, res);
  } catch (error) {
    console.error('[AUTH_MIDDLEWARE]', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const { body } = req;
      const { name } = body;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const store = await prismadb.store.create({
        data: {
          name,
          userId: req.auth.userId, // Agora você pode acessar o userId do middleware
        },
      });

      return res.status(200).json(store);
    }
  } catch (error) {
    console.error('[STORES_POST]', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default withServerSideAuth(middleware);
