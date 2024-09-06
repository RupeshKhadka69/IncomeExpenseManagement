import React from 'react'
import AdminProvider from './AdminContext'
import QueryProvider from './QueryProvider'
const ContextProvider = ({children}) => {
  return (
    <QueryProvider>
      <AdminProvider>{children}</AdminProvider>
    </QueryProvider>
  )
}

export default ContextProvider