import MasterLayout from 'Layout/MasterLayout'
import { apiRouting } from 'config/apiRouting'
import Dashboard from 'pages/Dashboard'
import AddGoals from 'pages/Goals/Form'
import Goals from 'pages/Goals/List'
import PageNotFound from 'pages/PageNotFound'

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const PrivateRouting = () => {
    return (
        <Routes>
            <Route element={<MasterLayout />}>
                <Route path={apiRouting.home} element={<Navigate to={apiRouting.dashboard} />} />
                <Route path={apiRouting.dashboard} element={<Dashboard />} />
                <Route path={apiRouting.goal.list} element={<Goals />} />
                <Route path={apiRouting.goal.add} element={<AddGoals />} />
                <Route path={apiRouting.goal.edit} element={<AddGoals />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

export default PrivateRouting