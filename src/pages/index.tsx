import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext } from 'next'
import { useAuth } from '@clerk/nextjs'

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
  const { userId } = useAuth();

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
}
