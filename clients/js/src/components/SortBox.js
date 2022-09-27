import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/solid';
import React, { Fragment, useEffect, useState } from 'react';

import usePrevious from '../hooks/UsePrevious';

function SortBox({
  items,
  selectedIndex,
  displayField,
  className,
  onSelected,
}) {
  const [selected, setSelected] = useState(null);
  const previousSelectedIndex = usePrevious(selected ? selected.id : null);

  const handleChange = (item) => {
    setSelected(item);
    if (!selected || (selected && selected.id !== item.id)) {
      onSelected(item);
    }
  };

  useEffect(() => {
    if (previousSelectedIndex !== selectedIndex) {
      setSelected(items[selectedIndex]);
    } else if (
      previousSelectedIndex === -1 &&
      selectedIndex === -1 &&
      selected
    ) {
      setSelected(items[selectedIndex]);
    }
  });

  // <SelectorIcon className="w-4 h-4 text-slate-600" />
  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className={`${className} relative`}>
        <Listbox.Button className="relative flex items-center w-full shadow shadow-100 cursor-default focus:outline-none focus:bg-white">
          <span className="block px-2 text-left truncate">
            {selected ? selected[displayField] : 'Sort by ...'}
          </span>
          <span className="right-0 inline-block pr-1 ml-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute w-full mt-6 border-[1px] border-100 overflow-auto rounded-sm shadow-lg bg-white">
            {items.map((item, i) => (
              <Listbox.Option
                key={`sortinfo_${i}`}
                value={item}
                className={({ active }) =>
                  `${
                    active ? 'text-900 bg-100' : 'text-gray-900'
                  } cursor-default select-none relative py-1 pl-4 md:pl-6`
                }
              >
                {({ selected }) => (
                  <>
                    <span className="p-1 pl-2 block truncate">
                      {item[displayField]}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-900">
                        <CheckIcon
                          className="w-4 h-4 md:w-5 md:h-5"
                          aria-hidden="true"
                        />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export default SortBox;
