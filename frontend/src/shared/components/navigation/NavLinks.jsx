import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = () => {
  const { isLoggedIn, logout } = useAuthContext();

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>HOME</NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to="/my-listings" exact>MY LISTINGS</NavLink>
        </li>
      )}
 
      {isLoggedIn && (
        <li>
          <NavLink to="/items/new" exact>ADD ITEM</NavLink>
        </li>
      )}
      {!isLoggedIn && (
        <>
          <li>
            <NavLink to="/login" exact>LOGIN</NavLink>
          </li>
          <li>
            <NavLink to="/signup" exact>SIGNUP</NavLink>
          </li>
        </>
      )}
      {isLoggedIn && (
        <li>
          <button onClick={logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
