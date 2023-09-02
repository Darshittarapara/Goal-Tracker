import Nav from 'react-bootstrap/Nav';
import React from 'react'
import { apiRouting } from 'config/apiRouting';
import { Strings } from 'config/Strings';
import "./Navbar.scss";
import { useLocation } from 'react-router';

const Navbar = () => {
    const { pathname } = useLocation();
    const setActiveClass = (routingPath: string) => {
        return routingPath === pathname
    }
    return (
        <Nav as="ul">
            <Nav.Item as="li">
                <Nav.Link className="nav-link" active={setActiveClass(apiRouting.dashboard)} href={apiRouting.dashboard}>{Strings.dashboard}</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <Nav.Link className="nav-link" active={setActiveClass(apiRouting.goal.list)} href={apiRouting.goal.list}>{Strings.goals}</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <Nav.Link className="nav-link" active={setActiveClass(apiRouting.goal.add)} href={apiRouting.goal.add}>{Strings.addGoals}</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}

export default Navbar