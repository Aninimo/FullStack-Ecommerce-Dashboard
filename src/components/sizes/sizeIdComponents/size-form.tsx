import { useState } from 'react'
import { useRouter } from 'next/router'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Trash } from 'lucide-react'

import { AlertModal } from '../../modals/alert-modal'
import { Heading } from '../../ui/heading'
import { Separator } from '../../ui/separator'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
} from '../../ui/form'
import { SizeProps } from '../../../types'

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
})

type SizeFormValues = z.infer<typeof formSchema>

interface SizeFormProps {
  initialData: SizeProps | null; 
}

export function SizeForm({
  initialData
}: SizeFormProps){
  const router = useRouter()
  const params = router.query
  
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit size' : 'Create size';
  const description = initialData ? 'Edit a size.' : 'Add a new size';
  const toastMessage = initialData ? 'Size updated.' : 'Size created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    }
  })

  const onSubmit = async (data: SizeFormValues) => {
  setLoading(true)
  try {
    const url = initialData
      ? `/api/${params.storeId}/sizes/${params.sizeId}`
      : `/api/${params.storeId}/sizes`;

    const method = initialData ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const responseData = await response.json();
    toast.success(toastMessage);

    router.push({
      pathname: `/${params.storeId}/routes/sizes`,
      query: { formData: responseData },
    });
  } catch (error: any) {
    toast.error('Something went wrong.');
  } finally {
    setLoading(false);
  }
}

  const onDelete = async () => {
    try{
      setLoading(true)
      const response = await fetch(`/api/${params.storeId}/sizes/${params.sizeId}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) 
      })
      toast.success('Size deleted.')
      window.location.reload()
    }catch (error: any) {
      toast.error('Make sure you removed all products using this size first.')
    }finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return(
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant='destructive'
            size='sm'
            onClick={() => setOpen(true)}
          >
            <Trash className='h-4 w-4'/>
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <div>
                <FormLabel>Name</FormLabel>
                <Input disabled={loading} placeholder='Size name' {...field} />
                <FormMessage />
              </div>
            )}
          />
          <FormField
            control={form.control}
            name='value'
            render={({ field }) => (
              <div>
                <FormLabel>Value</FormLabel>
                <Input disabled={loading} placeholder='Size value' {...field} />
                <FormMessage />
              </div>
            )}
          />
          <Button disabled={loading} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
