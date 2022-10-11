import React from 'react';

import useQueryParams from '../hooks/useQueryParams';

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
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {shelves ? (
        <div className="dark-border mt-4 flex flex-col rounded-l border-l-[1px] border-l-50 p-2 dark:border-l-[1px] dark:border-l-slate-500 dark:shadow-slate-400">
          <div className="font-snas dark-text-light border-b-[1px] border-b-100 font-bold text-900 dark:border-b-[1px] dark:border-slate-400">
            Bookshelves
          </div>
          <div className="bs-scrollbar dark:dark-scrollbar mt-2 overflow-y-hidden scroll-smooth pr-4  hover:overflow-y-scroll dark:text-slate-300">
            {shelves.map(({ key }) => (
              <div
                className="mr-2 px-1 font-sans text-[0.85rem] text-800"
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
