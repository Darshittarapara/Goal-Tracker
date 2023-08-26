import React from 'react'
import { Strings } from 'config/Strings'
import { Button } from "react-bootstrap"
import { useAuthContext } from 'context/AuthContext/AuthContext'
const Header = () => {
    const { logOut } = useAuthContext()
    return (
        <div>
            <Button variant="danger" onClick={logOut}>
                {Strings.logOut}
            </Button>
        </div>
    )
}

export default Header