import { useState } from 'react'
import { useRouter } from 'next/router'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Modal } from '../ui/modal'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useStoreModal } from '../../hooks/use-store-modal'

const formSchema = z.object({
  name: z.string().min(1),
})

export function StoreModal(){
  const storeModal = useStoreModal()

  const [loading, setLoading] = useState(false)
  const router = useRouter()
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const responseData = await response.json()
      
      router.push({
        pathname: `/${responseData.id}`,
        query: { formData: responseData }, 
      });
    
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }
  
  return(
    <Modal
      title='Create store'
      description='Add a new store to manage products and categories.'
      isOpen={storeModal.isOpen} 
      onClose={storeModal.onClose}
    >
      <div>
        <div className='space-y-4 py-2 pb-4'>
          <div className='space-y-2'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder='E-Commerce' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                  <Button disabled={loading} variant='outline' onClick={storeModal.onClose}>
                    Cancel
                  </Button>
                  <Button disabled={loading} type='submit'>Continue</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  )
}
