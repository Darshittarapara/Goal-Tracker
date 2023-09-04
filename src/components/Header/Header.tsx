import React, { useEffect, useRef, useState } from 'react'
import { Strings } from 'config/Strings'
import { useAuthContext } from 'context/AuthContext/AuthContext'
import Img from 'components/Image'
import Logo from "assets/image/logo.png";
import Navbar from './Navbar/Navbar'
import "./Header.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faClose, faSignOut } from '@fortawesome/free-solid-svg-icons'
import Icon from 'components/Icons'
import { apiRouting } from 'config/apiRouting';
import { useNavigate } from 'react-router';
const Header = () => {
    const navigator = useNavigate();
    const { logOut } = useAuthContext()
    const [isMenubarOpen, setIsMenubarOpen] = useState(false)
    const navContainerClass = isMenubarOpen ? "show-menubar" : "";
    const toggleNavBar = (isOpen: boolean) => {
        setIsMenubarOpen(isOpen)
    }
    const redirectToDashboard = () => {
        navigator(apiRouting.dashboard)
    }
    return (
        <div className='header'>
            <div className="row m-0">
                <div className='col-md-4 col-sm-4 col-xl-4 col-4'>
                    <div className='header-logo' onClick={redirectToDashboard}>
                        <Img src={Logo} alt="logo" className='logo' />
                    </div>
                </div>
                <div className='col-md-8 col-sm-8 col-xl-8 col-8'>
                    <div className='float-end pr-10 m-2 d-flex'>
                        {!isMenubarOpen && <div className='menu-container' onClick={() => {
                            toggleNavBar(true);
                        }}>
                            <Icon icon={faBars} />
                        </div>}
                        {isMenubarOpen && (
                            <div className='close-container' onClick={() => {
                                toggleNavBar(false);
                            }}>
                                <Icon icon={faClose} />
                            </div>
                        )}
                        <Navbar navToggleClass={navContainerClass} toggleNavBar={toggleNavBar} />
                        <span className='btn bg-danger text-light log-out-button' title={Strings.logOut} onClick={logOut}>
                            <FontAwesomeIcon icon={faSignOut} />
                        </span>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Header