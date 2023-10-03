import { withServerSideAuth } from '@clerk/nextjs/ssr'

import SetupPage from './SetupPage'
import prismadb from '../lib/prismadb'

export default function App() {  
  return (
    <SetupPage/>
  )
}

export const getServerSideProps = withServerSideAuth(async ({ req, res }) => {
  const { userId } = req.auth;

  if (!userId) {
    res.writeHead(302, { Location: '/sign-in' });
    res.end();
    return { props: {} };
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    res.writeHead(302, { Location: `/${store.id}` });
    res.end();
  }

  return { props: {} };
});
