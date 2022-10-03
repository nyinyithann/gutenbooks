import React from 'react';

function Bookshelves({ shelves }) {
  if (!shelves) return null;
  return (
    <div className="flex flex-col border-l-[1px] shadow rounded p-2">
      <div className="font-snas font-bold text-900 border-b-[1px] border-b-200">Bookshelves</div>
      <div className="overflow-y-scroll scroll-smooth mt-2">
        {shelves.map(({ key, doc_count }) => {
          return (
            <div className="font-sans text-800 text-[0.85rem] p-1" key={key}>
              <span className="hover:underline hover:cursor-pointer">
                {key}
              </span>
              <span className="ml-2 text-[0.7rem] rounded bg-50 p-1">
                {doc_count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Bookshelves;
