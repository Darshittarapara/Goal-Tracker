import { Strings } from 'config/Strings'
import { useAuthContext } from 'context/AuthContext/AuthContext'
import React from 'react'
import { Container } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
const Login = () => {
    const { login, backgroundColor, preViousColor } = useAuthContext()
    const style = {
        background: `linear-gradient(135deg, ${backgroundColor}, ${preViousColor})`,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: "0px",
        padding: "0px",

        transition: "background 1s easy-in-out"
    }

    return (
        <Container fluid style={{ ...style }} className='d-flex  justify-content-center align-items-center'>
            <Button variant="primary" onClick={login}>
                {Strings.login}
            </Button>
        </Container>
    )
}

export default Login