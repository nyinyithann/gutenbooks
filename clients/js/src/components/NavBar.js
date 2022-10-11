import React from 'react';

import Logo from './Logo';
import NavLink from './NavLink';
import ThemeMenu from './ThemeMenu';

function Navbar() {
  return (
    <nav className="dark-text fixed inset-x-0 z-50 flex-1 bg-300 py-2 shadow shadow-200 dark:bg-slate-800">
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center font-nav text-xl font-black md:text-lg lg:pl-[10rem]">
            <NavLink className="navbar-menu-text" to="/">
              Home
            </NavLink>
            <NavLink className="navbar-menu-text" to="/About">
              About
            </NavLink>
          </div>

          <div className="ml-[-6rem] hidden gap-1 md:flex">
            <div className="dark-bg-light rounded-full p-1 shadow-md shadow-700">
              <Logo fill="fill-klor-900/80" />
            </div>
            <div className="hidden items-center md:flex">
              <span className="text-center font-brand text-lg text-900 drop-shadow-2xl">
                Gutenbooks
              </span>
            </div>
          </div>
          <div className="relative flex items-center space-x-2 pr-1 lg:pr-[10rem]">
            <ThemeMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
