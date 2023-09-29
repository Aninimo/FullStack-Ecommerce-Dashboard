import { useRouter } from 'next/router'

import { ApiAlert } from './api-alert'
import { useOrigin } from '../../hooks/use-origin'

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

export function ApiList({
  entityName,
  entityIdName,
}: ApiListProps){
  const router = useRouter()
  const params = router.query
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}`} />
      <ApiAlert title='GET' variant='public' description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
      <ApiAlert title='POST' variant='admin' description={`${baseUrl}/${entityName}`} />
      <ApiAlert title='PATCH' variant='admin' description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
      <ApiAlert title='DELETE' variant='admin' description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
    </>
  )
}
