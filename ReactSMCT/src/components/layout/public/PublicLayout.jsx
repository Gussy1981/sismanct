import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Menu from './Menu'
import AdminMenu from '../admin/AdminMenu';
import useAuth from '../../../hooks/useAuth';

const PublicLayout = () => {
    
  const auth = useAuth();
    
  return (
    <>
        {/*Layout*/}
        <div>
            <Header />
        </div>
        <div>
          
          {auth.user && auth.user.role === "Administrador" ? <AdminMenu /> : <Menu />}
          
        </div>

        {/*Contenido Principal*/}
        <section className='layout__content'>
           <Outlet/>
        </section>
    </>
  )
}

export default PublicLayout