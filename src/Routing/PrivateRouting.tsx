import MasterLayout from 'Layout/MasterLayout'
import { apiRouting } from 'config/apiRouting'
import Dashboard from 'pages/Dashboard'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const PrivateRouting = () => {
    return (
        <Routes>
            <Route element={<MasterLayout />}>
                <Route path={apiRouting.home} element={<Dashboard />} />
            </Route>
        </Routes>
    )
}

export default PrivateRouting