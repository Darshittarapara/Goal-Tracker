import React from 'react'
import { Strings } from 'config/Strings'
import { Container } from "react-bootstrap"
import { useAuthContext } from 'context/AuthContext/AuthContext'
import Img from 'components/Image'
import Logo from "assets/image/logo.png";
import Navbar from './Navbar/Navbar'
import "./Header.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'
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
                    <div className='float-end pr-10 m-2 d-flex'>
                        <Navbar />
                        <span className='btn bg-danger text-light' title={Strings.logOut} onClick={logOut} style={{ cursor: "pointer", borderRadius: "10px" }}>
                            <FontAwesomeIcon icon={faSignOut} />
                        </span>

                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Header