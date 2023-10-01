import { useState } from 'react';
import { useRouter } from 'next/router';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { AlertModal } from '../../modals/alert-modal';
import { Heading } from '../../ui/heading';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { ColorProps } from '../../../types';

const formSchema = z.object({
  name: z.string().min(2),
  value: z.string().min(4).max(9).regex(/^#/, {
    message: 'String must be a valid hex code',
  }),
});

type ColorFormValues = z.infer<typeof formSchema>

interface ColorFormProps {
  initialData: ColorProps | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({
  initialData
}) => {
  const router = useRouter();
  const params = router.query;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit color' : 'Create color';
  const description = initialData ? 'Edit a color.' : 'Add a new color';
  const toastMessage = initialData ? 'Color updated.' : 'Color created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: ''
    }
  })

  const onSubmit = async (data: ColorFormValues) => {
  setLoading(true)
  try {
    const url = initialData
      ? `/api/${params.storeId}/colors/${params.colorId}`
      : `/api/${params.storeId}/colors`;

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

    const responseData = await response.json()
    toast.success(toastMessage);

    router.push({
      pathname: `/${params.storeId}/colors`,
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
      const response = await fetch(`/api/${params.storeId}/colors/${params.colorId}`,{
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
                    <Input disabled={loading} placeholder='Color name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-x-4'>
                      <Input disabled={loading} placeholder='Color value' {...field} />
                      <div
                        className='border p-4 rounded-full'
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
  );
}
