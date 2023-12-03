import { Fragment, useState } from 'react'
import Link from 'next/link'
import { Dialog, Popover, Tab, Transition, Menu, Listbox } from '@headlessui/react'
import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BiUserCircle } from 'react-icons/bi';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router';



const products = {
  pages: [
    { name: 'Our Services', href: '/ourservices' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ],
}

const locales = [
  {
    id: 1,
    name: 'en',
    avatar: 'https://plus.unsplash.com/premium_photo-1674591172747-2c1d461d7b68?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fHVzJTIwZmxhZ3xlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 2,
    name: 'ar',
    avatar: 'https://plus.unsplash.com/premium_photo-1675865395931-20d6782b28f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHVhZSUyMGZsYWd8ZW58MHx8MHx8fDA%3D',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example({ logout , user }) {
  const [open, setOpen] = useState(false)
  const router = useRouter();
  
  let getLocale = locales.filter((item)=>{
    return item.name === router.locale;
  })
  const [selected, setSelected] = useState(getLocale[0])



  return (
    <div className="bg-white">

      
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pt-5 pb-2">
                  <button type="button" className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400" onClick={() => setOpen(false)}>
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  {products.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <Link href={page.href} className="-m-2 no-underline block p-2 font-medium text-gray-900">
                        {page.name}
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  <div className="flow-root">
                    <Link href={'/login'} className="-m-2 block p-2 font-medium text-gray-900">
                      Sign in
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link href={'/signup'} className="-m-2 block p-2 font-medium text-gray-900">
                      Create account
                    </Link>
                  </div>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">

        {/* Laptop View */}
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button type="button" className="rounded-md bg-white p-2 text-gray-400 lg:hidden" onClick={() => setOpen(true)}>
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="mx-4 flex lg:ml-0">
                <Link href={'/'}>
                  <span className="sr-only">Accounting_Software</span>
                  <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt=""/>
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="">
                <div className="flex space-x-5">
                  {products.pages.map((page) => (
                    <Link key={page.name} href={page.href} className="flex no-underline items-center text-sm font-medium text-gray-700 hover:text-gray-800">{page.name}</Link>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">

                <Listbox value={selected} onChange={setSelected} >
                  {({ open }) => (
                    <>
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                          <span className="flex items-center">
                            <img src={selected.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                            <span className="ml-3 block truncate">{selected.name.toUpperCase()}</span>
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute pl-0 z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {locales.map((person) => (
                              <Link href={router.asPath} locale={person.name} className='no-underline'>
                                <Listbox.Option
                                  key={person.id}
                                  className={({ active }) =>
                                    classNames(
                                      active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                      'relative cursor-default select-none py-2 pl-3'
                                    )
                                  }
                                  value={person}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <div className="flex items-center">
                                        <img src={person.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                        <span
                                          className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                        >
                                          {person.name.toUpperCase()}
                                        </span>
                                      </div>

                                      {selected ? (
                                        <span
                                          className={classNames(
                                            active ? 'text-white' : 'text-indigo-600',
                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                          )}
                                        >
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              </Link>
                            ))}
                            {/* {router.locales.map((item, index)=>{
                              return <Link key={index} href={router.asPath} locale={item} className='text-2xl font-sans'>{item}</Link>
                            })} */}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>


                <div className="ml-4 hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <Link href={'/login'} className="text-sm font-bold text-black no-underline hover:text-gray-800">
                    Sign in
                  </Link>
                  <span className="h-6 w-px bg-gray-800" aria-hidden="true" />
                  <Link href={'/signup'} className="text-sm font-bold text-black no-underline hover:text-gray-800">
                    Create account
                  </Link>
                </div>
                        
                <Menu as="div" className="relative inline-block text-left">
                
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => ( <Link href={'/pannel'} className={classNames( active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 no-underline py-2 text-sm' )}>Admin Account</Link>)}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => ( <Link href={'/myaccount'} className={classNames( active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 no-underline py-2 text-sm' )}>Account settings</Link>)}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (<Link href="#" className={classNames( active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 no-underline text-sm')}>License</Link>)}
                    </Menu.Item>
                    <div>
                      <Menu.Item> 
                        {({ active }) => (<button onClick={logout}  className={classNames( active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm')}>Log Out</button>)}
                      </Menu.Item>
                    </div>
                  </div>
                </Menu.Items>
                </Transition>
                </Menu>



              </div>
            </div>
          </div>
        </nav>

      </header>
    </div>
  )
}
