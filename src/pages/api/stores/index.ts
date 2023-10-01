import { withServerSideAuth } from '@clerk/nextjs/ssr'

export default withServerSideAuth(async ({ req, res, context }) => {
  try {
    if (req.method === 'POST') {
      const { userId } = context.auth; // Obtenha o userId do contexto de autenticação
      const { body } = req;
      const { name } = body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const store = await prismadb.store.create({
        data: {
          name,
          userId,
        },
      });

      return res.status(200).json(store);
    }
  } catch (error) {
    console.error('[STORES_POST]', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
