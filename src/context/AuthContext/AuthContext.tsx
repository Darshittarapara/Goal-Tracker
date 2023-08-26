import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { LOGIN_KEY } from '../../helper/storage';
import { baseURL, endPoint } from 'config/colorConfig';

const AuthContext = createContext({
    isAuth: false,
    login: () => { },
    preViousColor: "",
    logOut: () => { },
    backgroundColor: "aliceblue"
});

interface AuthContextComponentProvider {
    children: React.ReactElement
};

const AuthContextProvider: React.FC<AuthContextComponentProvider> = ({
    children
}) => {
    const [isAuth, setIsAuth] = useState(false);
    const previousColor = useRef<string>("red")
    const [backgroundColor, setBackgroundColor] = useState("aliceblue")
    /**
     * When page load it check that user already login or not
     * If already login then set isAuth true
     */
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
    /**
     * This fetch the random color from API and return the latest color and update previous state
     */
    const getRandomColor = useCallback(async () => {
        if (baseURL && !isAuth) {
            const timestamp = new Date().getTime();
            const response = await ((await fetch(`${baseURL}${endPoint}?timestamp=${timestamp}`)).json())
            previousColor.current = backgroundColor
            if (response?.success) {
                return `#${response.colors?.[0]?.hex}`
            }
            previousColor.current = "red"
            return "aliceblue"
        }
        return "aliceblue"
    }, [backgroundColor, isAuth])

    /**
     * Update background color state
     */
    useEffect(() => {
        const timer = setInterval(async () => {
            const color = await getRandomColor();
            if (color) {
                setBackgroundColor(color)
            }
        }, 2000)
        return () => {
            clearInterval(timer)
        }
    }, [getRandomColor])

    const logOut = () => {
        setIsAuth(false);
        localStorage.clear()
    }
    const ctx = {
        isAuth,
        login,
        logOut,
        backgroundColor,
        preViousColor: previousColor?.current
    }

    return <AuthContext.Provider value={ctx}>
        {children}
    </AuthContext.Provider>
}
export const useAuthContext = () => {
    return useContext(AuthContext)
}

export default AuthContextProvider