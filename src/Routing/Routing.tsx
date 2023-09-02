import React from 'react'
import { useAuthContext } from '../context/AuthContext/AuthContext'
import PrivateRouting from './PrivateRouting'
import AuthRouting from './AuthRouting'

const Routing = () => {
    const { isAuth } = useAuthContext();
    console.log(isAuth)
    return (
        <>
            {isAuth ? <PrivateRouting /> : <AuthRouting />}
        </>
    )
}

export default Routing