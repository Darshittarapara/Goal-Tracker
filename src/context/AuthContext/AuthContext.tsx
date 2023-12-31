import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { LOGIN_EMAIL, TOKEN_KEY, USER, generateUUID } from '../../helper/storage';
import { baseURL, endPoint } from 'config/colorConfig';
import { addDataToFirebaseStore, getDocsFromFirebase } from "../../Firebase/service";
import { Strings } from 'config/Strings';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { apiRouting } from 'config/apiRouting';
import { getAuth, signOut } from "firebase/auth"
import { app } from '../../Firebase/config';
const AuthContext = createContext({
    isAuth: false,
    login: (email: string) => { },
    preViousColor: "",
    logOut: () => { },
    isLoading: false,
    backgroundColor: "aliceblue",
    signUp: (email: string) => { }
});

interface AuthContextComponentProvider {
    children: React.ReactElement
};

const AuthContextProvider: React.FC<AuthContextComponentProvider> = ({
    children
}) => {
    const navigator = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const previousColor = useRef<string>("red")
    const [backgroundColor, setBackgroundColor] = useState("aliceblue")
    /**
     * When page load it check that user already login or not
     * If already login then set isAuth true
     */
    useEffect(() => {
        const hasUserAlreadyLogin = localStorage.getItem(TOKEN_KEY);
        if (hasUserAlreadyLogin) {
            setIsAuth(true);
        }
    }, [])
    const login = async (email: string) => {
        setIsLoading(true)
        const data = await checkCurrentEmailAlreadyRegister(email)
        if (data) {
            setIsAuth(true);
            localStorage.setItem(TOKEN_KEY, `${data?.token}`);
            localStorage.setItem(LOGIN_EMAIL, `${data?.email}`);

        } else {
            Swal.fire({
                title: 'Oops !',
                text: `${email} ${Strings.emailNotRegister}`,
                icon: 'error',
                confirmButtonText: Strings.ok
            })
        }

        setIsLoading(false)
    }

    const checkCurrentEmailAlreadyRegister = async (email: string) => {
        const data: any[] = await getDocsFromFirebase(USER);
        const hasAlreadyRegister = data?.find((item) => {
            return item?.email?.includes(email)
        })
        return hasAlreadyRegister ? hasAlreadyRegister : false
    }
    /**
     * This function store the user data in a firebase storage with a unique Id
     * @param email 
     */
    const signUp = async (email: string) => {
        const payload = {
            email,
            token: generateUUID()
        }
        setIsLoading(true)
        const hasAlreadyRegister = await checkCurrentEmailAlreadyRegister(email);
        if (hasAlreadyRegister) {
            Swal.fire({
                title: 'Error!',
                text: `${email} ${Strings.emailAlreadyRegister}`,
                icon: 'error',
                confirmButtonText: Strings.ok
            })
            setIsLoading(false)
            return
        }

        const response = await addDataToFirebaseStore(USER, payload);
        const error = response as { error: string }

        if (!error?.error) {
            localStorage.setItem(TOKEN_KEY, payload.token);
            localStorage.setItem(LOGIN_EMAIL, payload.email);
            setIsAuth(true);
        } else {
            Swal.fire({
                title: 'Error!',
                text: error?.error as unknown as string,
                icon: 'error',
                confirmButtonText: Strings.ok
            })
        }
        setIsLoading(false)
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
        Swal.fire({
            title: 'Alert!',
            text: Strings.areYouSureWantToLogOut,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: Strings.logOut,
            cancelButtonText: Strings.cancel,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33"
        }).then(async (res) => {
            if (res.isConfirmed) {
                signOut(getAuth(app)).then(() => {
                    setIsAuth(false);
                    localStorage.clear()
                    navigator(apiRouting.home)
                }).catch((error) => {
                    alert(error)
                });

            }
        })

    }
    const ctx = {
        isAuth,
        isLoading,
        login,
        logOut,
        backgroundColor,
        signUp,
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