import FullLayout from '@/panel/layouts/FullLayout'
import React from 'react'
import { ProSidebarProvider } from 'react-pro-sidebar'

const Buildings = () => {
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

      <div>
        Buildings
      </div>


      
    </FullLayout>
    </ProSidebarProvider>
    
    </>
  )
}

export default Buildings