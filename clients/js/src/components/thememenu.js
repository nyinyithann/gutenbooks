import { Menu } from '@headlessui/react';
import { SwatchIcon } from '@heroicons/react/24/solid';

import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

function ColorButton({ color, theme, onClick }) {
  return (
    <button
      type="button"
      aria-label="color"
      className="theme-btn"
      data-theme={theme}
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  );
}

ColorButton.propTypes = {
  color: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const themeList = [
  [
    { color: '#94A3B8', theme: 'theme-slate' },
    { color: '#9CA3AF', theme: 'theme-gray' },
    { color: '#A1A1AA', theme: 'theme-zinc' },
    { color: '#A3A3A3', theme: 'theme-neutral' },
  ],
  [
    { color: '#A8A29E', theme: 'theme-stone' },
    { color: '#F87171', theme: 'theme-red' },
    { color: '#FB923C', theme: 'theme-orange' },
    { color: '#FBBF24', theme: 'theme-amber' },
  ],
  [
    { color: '#FACC15', theme: 'theme-yellow' },
    { color: '#A3E635', theme: 'theme-lime' },
    { color: '#4ADE80', theme: 'theme-green' },
    { color: '#34D399', theme: 'theme-emerald' },
  ],
  [
    { color: '#2DD4BF', theme: 'theme-teal' },
    { color: '#22D3EE', theme: 'theme-cyan' },
    { color: '#38BDF8', theme: 'theme-sky' },
    { color: '#60A5FA', theme: 'theme-blue' },
  ],
  [
    { color: '#818CF8', theme: 'theme-indigo' },
    { color: '#A78BFA', theme: 'theme-violet' },
    { color: '#C084FC', theme: 'theme-purple' },
    { color: '#E879F9', theme: 'theme-fuchsia' },
  ],
  [
    { color: '#F472B6', theme: 'theme-pink' },
    { color: '#FB7185', theme: 'theme-rose' },
  ],
];

function ThemeMenu({ setTheme }) {
  const clickHandler = useCallback((e) => {
    e.preventDefault();
    setTheme(e.target.getAttribute('data-theme'));
  });

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="theme-menu-opener">
        <SwatchIcon className="h-5 w-5 items-center text-primary_900" />
      </Menu.Button>
      <Menu.Items as="div" className="theme-menu-dropdown">
        <Menu.Item>
          <div className="flex flex-col z-10">
            {themeList.map((x, i) => (
              <div key={`thememenu_${i}`} className="theme-menu-internal-div">
                {x.map(({ color, theme }) => (
                  <ColorButton
                    key={color}
                    color={color}
                    theme={theme}
                    onClick={clickHandler}
                  />
                ))}
              </div>
            ))}
          </div>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

ThemeMenu.propTypes = {
  setTheme: PropTypes.func.isRequired,
};
export default ThemeMenu;
