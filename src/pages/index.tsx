import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { useAuth } from '@clerk/nextjs'
import { getAuth } from '@clerk/nextjs/server'

import SetupPage from './SetupPage'
import prismadb from '../lib/prismadb'

export default function App() {  
  const router = useRouter()
  const { userId } = useAuth();
 
  useEffect(() => {
    if (!userId) {
      router.push('/sign-in');
    }
  }, [userId, router]);
  
  return (
    <>
      <SetupPage/>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = getAuth(ctx.req);
  const userId = auth.userId || '';
  
  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    context.res.writeHead(302, { Location: `/${store.id}` });
    context.res.end();
  }

  return { props: {} };
}
