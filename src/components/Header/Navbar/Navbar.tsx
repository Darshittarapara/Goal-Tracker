import React, { LegacyRef } from 'react'
import { apiRouting } from 'config/apiRouting';
import { Strings } from 'config/Strings';
import "./Navbar.scss";
import { NavLink } from 'react-router-dom';
interface NavbarProps {
    navToggleClass: string;
    toggleNavBar: (isOpen: boolean) => void
}
const Navbar: React.FC<NavbarProps> = ({
    navToggleClass, toggleNavBar
}) => {
    const navLinks = [
        {
            title: Strings.dashboard,
            path: apiRouting.dashboard
        },
        {
            title: Strings.goals,
            path: apiRouting.goal.list
        },
        {
            title: Strings.addGoals,
            path: apiRouting.goal.add
        },
    ]
    return (
        <ul className={`nav ${navToggleClass}`}>
            {navLinks.map(({ title, path }, index) => {
                return (
                    <li className='nav-item' onClick={() => toggleNavBar(false)}>
                        <NavLink className={({ isActive }) => {
                            return isActive ? "nav-link active" : 'nav-link'
                        }} to={path}>{title}</NavLink>
                    </li>
                )
            })}
        </ul>
    )
}

export default Navbar