import React from 'react';
import useQueryParams from '../hooks/UseQueryParams';

function Bookshelves({ shelves }) {
  if (!shelves) return null;

  const [_, setUrlQueryParam] = useQueryParams('books');

  const selectBookshelve = (e) => {
    e.preventDefault();
    const shelve = e.target.innerText;
    if (shelve) {
      console.log(shelve);
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
    <div className="flex flex-col border-[1px] shadow shadow-slate-200 rounded p-2 dark:shadow-slate-500 dark-border">
      <div className="font-snas font-bold text-900 border-b-[1px] border-b-200 dark:border-slate-400 dark-text-light">
        Bookshelves
      </div>
      <div className="grid grid-cols-1 divide-y divide-slate-100 overflow-y-scroll scroll-smooth bs-scrollbar mt-2 dark:dark-scrollbar dark:divide-slate-500 dark:text-slate-300">
        {shelves.map(({ key }) => {
          return (
            <div
              className="font-sans text-800 text-[0.85rem] p-1 mr-2"
              key={key}
            >
              <span
                className="hover:underline hover:cursor-pointer"
                onClick={selectBookshelve}
              >
                {key}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Bookshelves;
