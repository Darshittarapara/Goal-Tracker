import React from 'react'
import { apiRouting } from 'config/apiRouting';
import { Strings } from 'config/Strings';
import "./Navbar.scss";
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <ul className='nav'>
            <li className='nav-item'>
                <NavLink className={({ isActive }) => {
                    return isActive ? "nav-link active" : 'nav-link'

                }} to={apiRouting.dashboard}>{Strings.dashboard}</NavLink>
            </li>
            <li className='nav-item'>
                <NavLink className={({ isActive }) => {
                    return isActive ? "nav-link active" : 'nav-link'
                }} to={apiRouting.goal.list}>{Strings.goals}</NavLink>
            </li>
            <li className='nav-item'>
                <NavLink className={({ isActive }) => {
                    return isActive ? "nav-link active" : 'nav-link'
                }} to={apiRouting.goal.add}>{Strings.addGoals}</NavLink>
            </li>
        </ul>
    )
}

export default Navbar