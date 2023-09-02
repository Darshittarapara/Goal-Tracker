import React from 'react'
import { Strings } from 'config/Strings'
import { Button, Col, Container, Row } from "react-bootstrap"
import { useAuthContext } from 'context/AuthContext/AuthContext'
import Img from 'components/Image'
import Logo from "assets/image/logo.png";
import Navbar from './Navbar/Navbar'
import "./Header.scss";

const Header = () => {
    const { logOut } = useAuthContext()
    return (
        <Container fluid className='header'>
            <div className="row">
                <div className='col-md-4 col-sm-4 col-xl-4'>
                    <div className='header-logo'>
                        <Img src={Logo} alt="logo" className='logo' />
                    </div>
                </div>
                <div className='col-md-8 col-sm-8 col-xl-8'>
                    <div className='row'>
                        <div className='col-md-6 col-sm-6 col-xl-6'>
                            <Navbar />
                        </div>
                        <div className='col-md-6 col-sm-6 col-xl-6'>
                            <div className='float-end pr-10 m-2'>
                                <Button variant="danger" onClick={logOut}>
                                    {Strings.logOut}
                                </Button>
                            </div>

                        </div>
                    </div>


                </div>

            </div>

        </Container>
    )
}

export default Header