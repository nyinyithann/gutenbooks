import { Menu } from '@headlessui/react';
import React, { Fragment, useCallback } from 'react';

import { ThemeSwitchContext } from '../providers/ThemeSwitchProvider';

const themeList = [
  [
    { color: '#000000', theme: 'dark' },
    { color: '#94A3B8', theme: 'theme-slate' },
    { color: '#A3A3A3', theme: 'theme-neutral' },
    { color: '#cccccc', theme: 'theme-lightgray' },
  ],
  [
    { color: '#FB7185', theme: 'theme-rose' },
    { color: '#F472B6', theme: 'theme-pink' },
    { color: '#ff9494', theme: 'theme-monalisa' },
    { color: '#cf9068', theme: 'theme-coffee' },
  ],
  [
    { color: '#FB923C', theme: 'theme-orange' },
    { color: '#b2ad55', theme: 'theme-olive' },
    { color: '#FACC15', theme: 'theme-yellow' },
    { color: '#e8e121', theme: 'theme-sunflower' },
  ],
  [
    { color: '#4ADE80', theme: 'theme-green' },
    { color: '#34D399', theme: 'theme-emerald' },
    { color: '#2DD4BF', theme: 'theme-teal' },
    { color: '#A3E635', theme: 'theme-lime' },
  ],
  [
    { color: '#60A5FA', theme: 'theme-blue' },
    { color: '#38BDF8', theme: 'theme-sky' },
    { color: '#22D3EE', theme: 'theme-cyan' },
    { color: '#a2b3d7', theme: 'theme-polo' },
  ],
  [
    { color: '#818CF8', theme: 'theme-indigo' },
    { color: '#A78BFA', theme: 'theme-violet' },
    { color: '#C084FC', theme: 'theme-purple' },
    { color: '#E879F9', theme: 'theme-fuchsia' },
  ],
];

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

function ThemeMenu() {
  const { setTheme } = React.useContext(ThemeSwitchContext);
  const [isOpen, setIsOpen] = React.useState(true);
  const clickHandler = useCallback(
    (e) => {
      e.preventDefault();
      setTheme(e.target.getAttribute('data-theme'));
      setIsOpen(false);
    },
    [setTheme]
  );

  return (
    <Menu as="div" className="relative z-50 flex items-center text-left">
      {({ open }) => (
        <>
          <Menu.Button
            className="dark-border flex h-8 w-8 items-center justify-center rounded-full border-transparent bg-200 text-700 outline-none ring-0 saturate-150 hover:bg-400 hover:text-white dark:border-[1px] dark:bg-gray-700"
            onMouseOver={() => setIsOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 flex-1 pl-1 pt-1"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                clipRule="evenodd"
              />
            </svg>
          </Menu.Button>
          {open && isOpen && (
            <Menu.Items
              as="div"
              className="absolute right-1 top-6 mt-4 flex w-[12rem] origin-top-right
            flex-col rounded bg-500 shadow-md focus:outline-none dark:border-[1px] dark:border-slate-500 dark:bg-slate-600  md:w-40"
            >
              <Menu.Item as={Fragment}>
                <div className="z-10 flex flex-col rounded bg-300/80 p-1">
                  {themeList.map((x, i) => (
                    /* eslint-disable react/no-array-index-key */
                    <div
                      key={`${x.theme}_${i}`}
                      className="flex flex-1 flex-row flex-wrap justify-start gap-3 p-2"
                    >
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
          )}
        </>
      )}
    </Menu>
  );
}

export default ThemeMenu;
