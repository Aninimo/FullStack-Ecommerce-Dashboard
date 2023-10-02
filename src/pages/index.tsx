import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react'; 
import { useRouter } from 'next/router';

import SetupPage from './SetupPage';
import prismadb from '../lib/prismadb';

export default function App() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => { 
    if (!user) {
      router.push('/sign-in');
    } else {
      const fetchStore = async () => {
        const store = await prismadb.store.findFirst({
          where: {
            userId: user.id,
          },
        });

        if (store) {
          router.push(`/${store.id}`);
        }
      };

      fetchStore();
    }
  }, [user, router]);

  return (
    <>
      <SetupPage/>
    </>
  )
}
