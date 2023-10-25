import React, { useEffect } from 'react'
import FullLayout from '@/panel/layouts/FullLayout';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { ProSidebarProvider } from 'react-pro-sidebar';
import ReactToPrint from 'react-to-print';
import { ToastContainer } from 'react-toastify';

const TenantStatement = () => {

  const router = useRouter();
  const searchParams = useSearchParams()
  const tenantId = searchParams.get('id')


  
  useEffect(() => {
    console.log(tenantId)
    
  }, [tenantId])
  

  return (
    
  <>
  <ProSidebarProvider>
  <style jsx global>{`
    footer {
      display: none;
    }
    header {
      display: none;
    }
  `}</style>
  <FullLayout>
  {/* React tostify */}
  <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>

  <div className="mt-10 sm:mt-0">
    <div className="md:grid md:grid-cols-1 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0 flex">
          <h3 className="text-lg font-semibold leading-6 text-gray-900">Tenant Statement</h3>
        </div>
      </div>
      <div className="mt-2 md:col-span-2 md:mt-0">

        <form method="POST">
          <div className="overflow-hidden shadow sm:rounded-md">
          
            
          </div>
        </form>
      </div>
    </div>
  </div>

  </FullLayout>
  </ProSidebarProvider>
  </>
  )
}

export default TenantStatement