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
import { ImageUpload } from '../../ui/image-upload'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form'
import { BillboardProps } from '../../../types'

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
})

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
  initialData: BillboardProps | null;
}

export function BillboardForm({
  initialData
}: BillboardFormProps){
  const router = useRouter()
  const params = router.query

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit billboard' : 'Create billboard'
  const description = initialData ? 'Edit a billboard.' : 'Add a new billboard'
  const toastMessage = initialData ? 'Billboard updated.' : 'Billboard created.'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  })
  
  const onSubmit = async (data: BillboardFormValues) => {
  setLoading(true)
  try {
    const url = initialData
      ? `/api/${params.storeId}/billboards/${params.billboardId}`
      : `/api/${params.storeId}/billboards`;

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
      pathname: `/${params.storeId}/routes/billboards`,
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
      const response = await fetch(`/api/${params.storeId}/billboards/${params.billboardId}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) 
      })
      toast.success('Billboard deleted.')
      window.location.reload()
    }catch (error: any) {
      toast.error('Make sure you removed all categories using this billboard first.')
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
            <Trash className='h-4 w-4' />
          </Button>
        )}
       </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value ? [field.value] : []} 
                      disabled={loading} 
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className='md:grid md:grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Billboard label' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
