import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/solid';
import React, { Fragment, useEffect, useState } from 'react';

import usePrevious from '../hooks/usePrevious';

const items = [
  { id: 0, desc: 'Book Id: Asc', sort: [{ field: 'id', order: 'asc' }] },
  { id: 1, desc: 'Book Id: Desc', sort: [{ field: 'id', order: 'desc' }] },
  {
    id: 2,
    desc: 'Title: A to Z',
    sort: [{ field: 'title.keyword', order: 'asc' }],
  },
  {
    id: 3,
    desc: 'Title: Z to A',
    sort: [{ field: 'title.keyword', order: 'desc' }],
  },
  {
    id: 4,
    desc: 'Author: A to Z',
    sort: [{ field: 'authors.name.keyword', order: 'asc' }],
  },
  {
    id: 5,
    desc: 'Author: Z to A',
    sort: [{ field: 'authors.name.keyword', order: 'desc' }],
  },
  {
    id: 6,
    desc: 'Download: Asc',
    sort: [{ field: 'download_count', order: 'asc' }],
  },
  {
    id: 7,
    desc: 'Download: Desc',
    sort: [{ field: 'download_count', order: 'desc' }],
  },
];

function SortBox({ selectedIndex, displayField, className, onSelected }) {
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

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className={`${className} relative`}>
        <Listbox.Button className="relative flex w-full cursor-default focus:bg-white focus:outline-none dark:focus:bg-slate-400">
          <span className="block truncate px-2 text-left">
            {selected ? selected[displayField] : 'Sort by ...'}
          </span>
          <span className="right-0 my-auto ml-auto inline-block pr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-slate-600 dark:text-slate-700"
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
          <Listbox.Options className="absolute mt-[1.7rem] ml-[-0.2rem] w-full overflow-auto rounded-sm border-[1px] border-100 bg-slate-50 shadow-lg dark:border-slate-500 dark:bg-slate-600 dark:text-slate-200">
            {items.map((item) => (
              <Listbox.Option
                key={item.id}
                value={item}
                className={({ active }) =>
                  `${
                    active
                      ? 'dark-bg-mask-md bg-100 text-900 dark:text-slate-200'
                      : 'text-gray-900 dark:text-slate-400'
                  } relative cursor-default select-none py-1 pl-4 md:pl-6`
                }
              >
                {({ isSelected }) => (
                  <>
                    <span className="block truncate p-1 pl-2">
                      {item[displayField]}
                    </span>
                    {isSelected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-900">
                        <CheckIcon
                          className="h-4 w-4 md:h-5 md:w-5"
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
