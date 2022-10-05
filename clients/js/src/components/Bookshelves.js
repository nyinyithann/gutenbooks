import React from 'react';

import useQueryParams from '../hooks/UseQueryParams';

function Bookshelves({ shelves }) {
  const [_, setUrlQueryParam] = useQueryParams('books');

  const selectBookshelve = (e) => {
    e.preventDefault();
    const shelve = e.target.innerText;
    if (shelve) {
      const info = {
        query: shelve,
        fields: ['bookshelf'],
        sortIndex: -1,
        sort: [{ field: '_score', order: 'desc' }],
      };
      setUrlQueryParam(info);
    }
  };

  return (
    <>
      {shelves ? (
        <div className="dark-border flex flex-col rounded border-[1px] p-2 shadow shadow-slate-200 dark:shadow-slate-500">
          <div className="font-snas dark-text-light border-b-[1px] border-b-200 font-bold text-900 dark:border-slate-400">
            Bookshelves
          </div>
          <div className="bs-scrollbar dark:dark-scrollbar mt-2 grid grid-cols-1 divide-y divide-slate-100 overflow-y-scroll scroll-smooth dark:divide-slate-500 dark:text-slate-300">
            {shelves.map(({ key }) => (
              <div
                className="mr-2 p-1 font-sans text-[0.85rem] text-800"
                key={key}
              >
                <button
                  type="button"
                  className="text-left hover:cursor-pointer hover:underline"
                  onClick={selectBookshelve}
                >
                  {key}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Bookshelves;
