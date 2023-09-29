import { UserButton } from '@clerk/nextjs'

import { StoreSwitcher } from './store-switcher'
import { MainNav } from './main-nav'
import { StoreProps } from '../types'

interface NavbarProps {
  stores: StoreProps[];
}

export function Navbar({ stores }: NavbarProps) {
  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <StoreSwitcher stores={stores}/>
        <MainNav className='mx-6'/>
        <div className='ml-auto flex items-center space-x-4'>       
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
