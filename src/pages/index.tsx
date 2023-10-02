import { useEffect } from 'react'; 
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs'
 
import SetupPage from './SetupPage';
import prismadb from '../lib/prismadb';

export default function App() {
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => { 
    if (!userId) {
      router.push('/sign-in');
    } else {
      const fetchStore = async () => {
        const store = await prismadb.store.findFirst({
          where: {
            userId
          },
        });

        if (store) {
          router.push(`/${store.id}`);
        }
      };

      fetchStore();
    }
  }, [userId, router]);

  return (
    <>
      <SetupPage/>
    </>
  )
}
