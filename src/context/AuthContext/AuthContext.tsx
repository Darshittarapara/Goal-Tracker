import React, { createContext, useContext, useEffect, useState } from 'react'
import { LOGIN_KEY } from '../../helper/storage';

const AuthContext = createContext({
    isAuth: false,
    login: () => { },
    logOut: () => { }
});

interface AuthContextComponentProvider {
    children: React.ReactElement
};

const AuthContextProvider: React.FC<AuthContextComponentProvider> = ({
    children
}) => {
    const [isAuth, setIsAuth] = useState(false);
    useEffect(() => {
        const hasUserAlreadyLogin = localStorage.getItem(LOGIN_KEY);
        if (hasUserAlreadyLogin) {
            setIsAuth(Boolean(hasUserAlreadyLogin))
        }
    }, [])
    const login = () => {
        setIsAuth(true);
        localStorage.setItem(LOGIN_KEY, `${true}`)
    }
    const logOut = () => {
        setIsAuth(false);
        localStorage.clear()
    }
    const ctx = {
        isAuth,
        login,
        logOut
    }

    return <AuthContext.Provider value={ctx}>
        {children}
    </AuthContext.Provider>
}
export const useAuthContext = () => {
    return useContext(AuthContext)
}

export default AuthContextProvider