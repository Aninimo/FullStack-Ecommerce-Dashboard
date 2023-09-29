import { useState } from 'react'
import { useRouter } from 'next/router'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { toast } from 'react-hot-toast'

import { AlertModal } from '../../modals/alert-modal'
import { Button } from '../../ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import { ColorColumn } from './columns'

interface CellActionProps {
  data: ColorColumn;
}

export function CellAction({
  data
}: CellActionProps){
  const router = useRouter()
  const params = router.query
  
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onConfirm = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/${params.storeId}/colors/${data.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast.success('Color deleted.')
        window.location.reload()
      } else {
        toast.error('Failed to delete size. Make sure you removed all products using this color first.')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred while deleting the color.')
    } finally {
      setOpen(false)
      setLoading(false)
    }
  }

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Color ID copied to clipboard.');
  }
  
  return(
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-onl'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onCopy(data.id)}
          >
            <Copy className='mr-2 h-4 w-4'/> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/routes/colors/${data.id}`)}
          >
            <Edit className='mr-2 h-4 w-4'/> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
          >
            <Trash className='mr-2 h-4 w-4'/> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
