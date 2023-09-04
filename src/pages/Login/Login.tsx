import TextInput from 'components/TextInput';
import { Strings } from 'config/Strings'
import { useAuthContext } from 'context/AuthContext/AuthContext'
import React, { useState } from 'react'
import { useFormik } from 'formik';
import ErrorMessage from 'components/ErrorMessage';
import { Container, Col, Row } from 'react-bootstrap'
import "./Login.scss";
import Button from 'react-bootstrap/Button';
import { AuthFormikValue } from 'Modal';
import Img from 'components/Image';
import Logo from "assets/image/logo.png";
import { LoginFormValidation } from 'helper/Validation';

const Login = () => {
    const [hasSignIn, setHasSignIn] = useState(false);
    const { login, isLoading, backgroundColor, preViousColor, signUp } = useAuthContext()

    const formik = useFormik<AuthFormikValue>({
        initialValues: {
            email: ""
        },
        validationSchema: LoginFormValidation,
        onSubmit: (formValues) => {
            if (hasSignIn) {
                signUp(formValues.email)
            } else {
                login(formValues.email)
            }
        }
    })
    const style = {
        background: `linear-gradient(135deg, ${backgroundColor}, ${preViousColor}, rgba(0,0,0,0.3))`,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: "0px",
        padding: "0px",

        transition: "background 1s easy-in-out"
    }
    const handleEmailChange = (value: string, name: string) => {
        formik.setFieldValue(name, value)
    }

    /**This will handler the login and sign up page */
    const handlerIsSignUpState = (isSignUp: boolean) => {
        formik.setFieldTouched("email", false);
        formik.setFieldValue("email", "");
        setHasSignIn(isSignUp)
    }
    const handlerEmailBlur = (name: string) => {
        formik.setFieldTouched(name, true);
    }
    return (
        <Container fluid style={{ ...style }} className='d-flex  justify-content-center align-items-center login-container'>
            <Row className="form-container">
                <Col className='logo-container'>
                    <Img src={Logo} alt="logo" className='logo' />
                </Col>
                <Col>
                    <form className='form' onSubmit={formik.handleSubmit}>
                        <TextInput
                            onBlur={handlerEmailBlur}
                            onChange={handleEmailChange}
                            name='email'
                            type='email'
                            value={formik.values.email}
                            labelText={Strings.email}
                            placeholder={Strings.email} />
                        {formik.errors.email && formik.touched.email && <ErrorMessage error={formik.errors.email} />}
                        <Button disabled={isLoading} type="submit" className='mt-2 mb-2' variant="primary">
                            {isLoading ? Strings.pleaseWait : (
                                hasSignIn ? Strings.signUp : Strings.login
                            )}
                        </Button>
                        {!hasSignIn ? <Button disabled={isLoading} onClick={() => handlerIsSignUpState(true)} variant='success'>{Strings.createAccount}</Button> :
                            <Button disabled={isLoading} onClick={() => handlerIsSignUpState(false)} variant='success'>{Strings.backToLogin}</Button>}
                    </form>
                </Col>
            </Row>
        </Container>
    )
}

export default Login