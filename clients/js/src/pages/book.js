import React, { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import usePrevious from '../hooks/UsePrevious';
import { BookContext } from '../providers/ContextProvider';

export default function Book() {
  const { bookDetail } = useContext(BookContext);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const previousId = usePrevious(id);
  const { getBookDetail, error, book } = bookDetail;

  useEffect(() => {
    if (previousId !== id) {
      getBookDetail(id);
    }
  });

  if (!id) {
    return (
      <div className="flex flex-col items-center m-6 p-6 border-[1px] rounded-sm shadow">
        <p className="block pb-4">A book id should be provided.</p>
        <a
          href="/"
          className="px-2 py-2 text-100 no-underline bg-500 rounded hover:bg-600 hover:underline hover:text-200"
        >
          Go back Home
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center m-6 p-6 border-[1px] rounded-sm shadow">
        <div>
          <span>
            There was an error in loading the book list.{' '}
            <span>Reload this page.</span>
          </span>
          <details className="pt-2 text-sm text-red-200">
            {error.message}
          </details>
        </div>
      </div>
    );
  }
  return <div>{book ? book.title : 'nah nah'}</div>;
}
