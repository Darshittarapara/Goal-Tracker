import Header from 'components/Header/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MasterLayout = () => {
    return (
        <div className='container'>
            <Header />
            <Outlet />
        </div>
    )
}

export default MasterLayout