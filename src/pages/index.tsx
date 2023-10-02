import { GetServerSidePropsContext } from 'next'
import { getAuth } from '@clerk/nextjs/server'

import SetupPage from './SetupPage';
import prismadb from '../lib/prismadb'

export default function MyPage() {
  return (
    <>
      <SetupPage />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { userId } = getAuth(context.req);

  if (!userId) {
    context.res.writeHead(302, { Location: '/sign-in' });
    context.res.end();
    return { props: {} };
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    context.res.writeHead(302, { Location: `/${store.id}` });
    context.res.end();
  }

  return {
    props: {},
  };
}
