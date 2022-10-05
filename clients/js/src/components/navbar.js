import React from 'react';

import Logo from './Logo';
import NavLink from './NavLink';
import ThemeMenu from './ThemeMenu';

function Navbar() {
  return (
    <nav className="py-2 bg-300 fixed inset-x-0 flex-1 z-50 shadow shadow-200 dark-bg dark-text">
      <div className="px-2">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="px-1 pt-1 shadow-md shadow-700 rounded-full dark-bg-light">
              <Logo fill="fill-klor-900/80" />
            </div>
            <div className="md:flex hidden items-center">
              <span className="text-center font-brand text-lg text-900 drop-shadow-2xl">
                Gutenbooks
              </span>
            </div>
            <div className="flex items-center font-nav text-xl md:text-lg font-black">
              <NavLink className="navbar-menu-text" to="/">
                Home
              </NavLink>
              <NavLink className="navbar-menu-text" to="/About">
                About
              </NavLink>
            </div>
          </div>
          <div className="flex items-center space-x-2 pr-1 relative">
            <ThemeMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
