import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext } from 'next'
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;

  const auth = getAuth(req);
  const userId = auth.userId || ''

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
