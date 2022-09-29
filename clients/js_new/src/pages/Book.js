import React, { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { BookContext } from '../providers/ContextProvider';

function Author({ detail }) {
  if (!detail) return null;

  const { name, birth_year, death_year, alias, webpage } = detail;

  const Name = ({ name, link }) => {
    return (
      <div className="flex gap-3">
        <span>Name</span>
        {link ? <a href={link}>{name}</a> : <span>{name}</span>}
      </div>
    );
  };

  const Pair = ({ label, value }) => {
    return (
      <div className="flex gap-3">
        <span>{label}</span>
        <span>{value}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex pb-2 border-b-[1px] border-b-400">Authors</div>
      <div className="flex flex-col gap-[2px]">
        <Name name={name} link={webpage} />
        <Pair label={'Birth Year'} value={birth_year} />
        <Pair label={'Death Year'} value={death_year} />
      </div>
    </div>
  );
}

export default function Book() {
  const { bookDetail } = useContext(BookContext);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { getBookDetail, error, book } = bookDetail;

  useEffect(() => {
    getBookDetail(id);
  }, [id, getBookDetail]);

  if (!id) {
    return (
      <div className="flex flex-col items-center m-6 p-6 border-[1px] rounded-sm shadow">
        <p className="block pb-4">
          Incorrect URL or book id is missing in URL search params.
        </p>
        <p className="font-nav font-medium text-900 underline cursor hover:text-700">
          <Link to="/">HOME</Link>
        </p>
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

  return (
    <main className="p-4">
      <div className="flex flex-row gap-1">
        <div className="flex-[1_1_0%] border-[1px] border-900">book image</div>
        <div className="flex-[4_1_0%] border-[1px] border-900">
          <p>{book ? book.title : ''}</p>
          <Author detail={book && book.authors ? book.authors[0] : null} />
        </div>
      </div>
    </main>
  );
}
