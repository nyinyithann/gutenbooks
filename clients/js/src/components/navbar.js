import PropTypes from 'prop-types';
import React from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '../../tailwind.config';
import Logo from './Logo';
import NavLink from './NavLink';
import ThemeMenu from './ThemeMenu';

const fullConfig = resolveConfig(tailwindConfig);

function Navbar({ setTheme }) {
  return (
    <nav className="bg-primary_300 py-1 md:pt-1 fixed inset-x-0 flex-1 z-50 shadow shadow-primary_200">
      <div className="px-2">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="px-1 pt-1 shadow-md shadow-primary_400 rounded-full">
              <Logo fill={fullConfig.theme.backgroundColor.primary_900} />
            </div>
            <div className="md:flex hidden items-center">
              <span className="text-center font-brand text-lg text-primary_900 drop-shadow-2xl">
                Gutenboks
              </span>
            </div>
            <div className="flex items-center font-nav text-lg font-black">
              <NavLink className="navbar-menu-text" to="/">
                Home
              </NavLink>

              <NavLink className="navbar-menu-text" to="/About">
                About
              </NavLink>
            </div>
          </div>
          <div className="flex items-center space-x-2 pr-1 relative">
            <ThemeMenu setTheme={setTheme} />
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  setTheme: PropTypes.func.isRequired,
};

export default Navbar;
