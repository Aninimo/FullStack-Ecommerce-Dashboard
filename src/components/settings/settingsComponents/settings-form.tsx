import { useState } from 'react'
import { useRouter } from 'next/router'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'

import { AlertModal } from '../../modals/alert-modal'
import { ApiAlert } from '../../ui/api-alert'
import { Heading } from '../../ui/heading'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { Separator } from '../../ui/separator'
import { useOrigin } from '../../../hooks/use-origin'
import { StoreProps } from '../../../types'

const formSchema = z.object({
  name: z.string().min(2)
})

type SettingsFormValues = z.infer<typeof formSchema>

interface SettingsFormProps {
  initialData: StoreProps;
}

export function SettingsForm({
  initialData
}: SettingsFormProps){
  const router = useRouter()
  const params = router.query
  
  const origin = useOrigin()
  
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const onSubmit = async (data: SettingsFormValues) => {
    try{
      setLoading(true)
      const response = await fetch(`/api/stores/${params.storeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      toast.success('Store updated.')
    }catch(error: any){
      toast.error('Something went wrong.')
    }finally{
      setLoading(false)
    }
  }

  const onDelete = async () => {
  try {
    setLoading(true);

    const response = await fetch(`/api/stores/${params.storeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      router.push('/'); 
      setOpen(false);
    } else {
      alert('Make sure you removed all products and categories first.');
    }
  } catch (error: any) {
    console.error('An error occurred during deletion:', error);
    alert('Something went wrong.');
  } finally {
    setLoading(false);
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
        <Heading title='Store settings' description='Manage store preferences' />
        <Button
          disabled={loading}
          variant='destructive'
          size='sm'
          onClick={() => setOpen(true)}
        >
          <Trash className='h-4 w-4' />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Store name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert 
        title='NEXT_PUBLIC_API_URL' 
        variant='public' 
        description={`${origin}/api/${params.storeId}`}
      />
    </>
  )
}
