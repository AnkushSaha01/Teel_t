import React from 'react'
import Form from '../components/Form'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const AppLayout = () => {
  return (
    <div className='bg-[#f0efeb] min-h-screen'>
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default AppLayout