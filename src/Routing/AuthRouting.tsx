import { apiRouting } from 'config/apiRouting'
import Login from 'pages/Login/Login'
import PageNotFound from 'pages/PageNotFound'
import React from 'react'
import { Routes, Route } from 'react-router-dom'

const AuthRouting = () => {
    return (
        <Routes>
            <Route path={apiRouting.home} element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

export default AuthRouting