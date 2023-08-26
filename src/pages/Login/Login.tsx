import { Strings } from 'config/Strings'
import { useAuthContext } from 'context/AuthContext/AuthContext'
import React from 'react'
import { Container } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
const Login = () => {
    const { login } = useAuthContext()
    return (
        <Container className='mt-3'>
            <Button variant="secondary" onClick={login}>
                {Strings.login}
            </Button>
        </Container>
    )
}

export default Login