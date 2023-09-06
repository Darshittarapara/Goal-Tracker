import React from 'react'
import { useAuthContext } from '../context/AuthContext/AuthContext'
import { Navigate, Route, Routes } from 'react-router'
import MasterLayout from 'Layout/MasterLayout'
import { apiRouting } from 'config/apiRouting'
import Dashboard from 'pages/Dashboard'
import AddGoals from 'pages/Goals/Form'
import Goals from 'pages/Goals/List'
import PageNotFound from 'pages/PageNotFound'
import Login from 'pages/Login/Login'
import ViewDailyProcess from 'pages/DailyProcess/View'
const Routing = () => {
    const { isAuth } = useAuthContext();

    return (
        <Routes>
            <Route element={<MasterLayout />}>
                <Route path={apiRouting.dashboard} element={<Dashboard />} />
                <Route path={apiRouting.goal.list} element={<Goals />} />
                <Route path={apiRouting.goal.add} element={<AddGoals />} />
                <Route path={apiRouting.goal.edit} element={<AddGoals />} />
                <Route path={apiRouting.goal.dailyProcess.view} element={<ViewDailyProcess />} />
            </Route>
            {isAuth ? <Route path={apiRouting.home} element={<Navigate to={apiRouting.dashboard} />} /> : <Route path={apiRouting.home} element={<Login />} />}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

export default Routing