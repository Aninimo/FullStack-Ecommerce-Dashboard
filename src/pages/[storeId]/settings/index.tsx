import { withServerSideAuth } from '@clerk/nextjs/ssr'
import { getAuth } from '@clerk/nextjs/server'

import { SettingsForm } from '../../../components/settings/settingsComponents/settings-form'
import prismadb from '../../../lib/prismadb'
import { StoreProps } from '../../../types'

interface SettingsPageProps {
  store: StoreProps;
}

export default function SettingsPage({ store }: SettingsPageProps){
  return(
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}

export const getServerSideProps = withServerSideAuth(async ({ req, params }) => {
  const { userId } = getAuth(req);
  const storeId = params?.storeId as string
   
  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId: userId as string,
    },
  })

  return {
    props: {
      store: JSON.parse(JSON.stringify(store)),
    },
  };
})
