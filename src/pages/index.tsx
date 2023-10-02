import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from "@clerk/nextjs";
 
import SetupPage from './SetupPage';
import prismadb from '../lib/prismadb';

export default function MyPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [hasStore, setHasStore] = useState(false);

  useEffect(() => {
    const checkStore = async () => {
      const store = await prismadb.store.findFirst({
        where: {
          userId,
        },
      });
    };

    if (!userId) {
      router.push('/sign-in');
    } else {
      checkStore();
    }
  }, [userId, router]);

  return (
    <>
      <SetupPage />
    </>
  );
}
