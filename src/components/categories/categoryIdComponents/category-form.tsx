import { useState } from 'react'
import { useRouter } from 'next/router'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Trash } from 'lucide-react'

import { AlertModal } from '../../modals/alert-modal'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Separator } from '../../ui/separator'
import { BillboardProps, CategoryProps } from '../../../types'

const formSchema = z.object({
  name: z.string().min(2),
  billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
  initialData: CategoryProps | null;
  billboards: BillboardProps[];
}

export function CategoryForm({
  initialData,
  billboards
}: CategoryFormProps){
  const router = useRouter()
  const params = router.query

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit category' : 'Create category';
  const description = initialData ? 'Edit a category.' : 'Add a new category';
  const toastMessage = initialData ? 'Category updated.' : 'Category created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: '',
    }
  })

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true)
    try {
      const url = initialData
      ? `/api/${params.storeId}/categories/${params.categoryId}`
      : `/api/${params.storeId}/categories`;

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
      pathname: `/${params.storeId}/routes/categories`,
      query: { formData: responseData },
    });
  } catch (error: any) {
    toast.error('Something went wrong.');
  } finally {
     setLoading(false)
    }
  }
  
  const onDelete = async () => {
    try{
      setLoading(true)
      const response = await fetch(`/api/${params.storeId}/categories/${params.categoryId}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) 
      })
      toast.success('Color deleted.')
      window.location.reload()
    }catch (error: any) {
      toast.error('Make sure you removed all products using this color first.')
    }finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
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
          <div className='md:grid md:grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Category name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='billboardId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a billboard' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.isArray(billboards) && billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}</SelectItem>
                      ))}                    </SelectContent>
                  </Select>
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
