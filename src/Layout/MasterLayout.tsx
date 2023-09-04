import Header from 'components/Header/Header'
import GoalContextProvider from 'context/GoalContext/GoalContext'
import React from 'react'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'


const MasterLayout = () => {
    return (
        <GoalContextProvider>
            <div className='container-fluid p-0'>
                <Header />
                <Container className="mt-2 p-4">
                    <Outlet />
                </Container>
            </div>
        </GoalContextProvider>
    )
}

export default MasterLayout