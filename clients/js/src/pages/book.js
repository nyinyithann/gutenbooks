import React, { useContext, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { getContentLinks, getImageLinks } from '../providers/common';
import { BookContext } from '../providers/ContextProvider';

function Title({ text }) {
  return text ? (
    <p className="mt-[-0.5rem] font-booktitle text-[1.1rem] dark:text-slate-300 md:text-[1.4rem]">
      {text}
    </p>
  ) : null;
}

function Bloke({ detail }) {
  if (!detail) return null;

  const Name = ({ name, link }) => (
    <div className="flex gap-3">
      <span className="flex w-[6rem] flex-shrink-0 items-center justify-start rounded-r-full bg-50/70 pl-1 text-900 dark:bg-slate-700 dark:text-slate-300">
        Name
      </span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="inline flex-none text-center text-700 underline dark:decoration-slate-400"
        >
          <p className="w-[12rem] text-left dark:text-slate-300 md:w-full">
            {name}
          </p>
        </a>
      ) : (
        <span className="dark:text-slate-300">{name}</span>
      )}
    </div>
  );

  const Pair = ({ label, value }) => {
    if (!value) return null;
    return (
      <div className="flex gap-3">
        <span className="w-[6rem] flex-shrink-0 rounded-r-full bg-50/70 pl-1 text-900 dark:bg-slate-700 dark:text-slate-300">{`${label}`}</span>
        <span className="max-w-[20rem] dark:text-slate-300">{value}</span>
      </div>
    );
  };

  const Alias = ({ names }) => {
    if (!names || names.length === 0) return null;
    return (
      <div className="flex gap-3">
        <div className="flex w-[6rem] flex-shrink-0 items-center justify-start rounded-r-full bg-50/70 pl-1 text-900 dark:bg-slate-700 dark:text-slate-300">
          <span>Alias</span>
        </div>
        <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-500">
          {names.map((n) => (
            <div key={n}>
              <span className="max-w-[20rem] dark:text-slate-300">{n}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const { name, birth_year, death_year, alias, webpage } = detail;

  return (
    <div className="flex w-full flex-col gap-[0.2rem] py-2 font-sans text-[0.9rem]">
      <Name name={name} link={webpage} />
      <Pair label="Birth Year" value={birth_year} />
      <Pair label="Death Year" value={death_year} />
      <Alias names={alias} />
    </div>
  );
}

const Blokes = ({ title, blokes }) => {
  if (!blokes || blokes.length === 0) return null;
  return (
    <div className="flex flex-col gap-[0.35rem] rounded-lg border-[1px] border-200 p-2 shadow dark:border-slate-500">
      <div className="flex rounded-t-md border-b-[1px] border-b-200 bg-100 pb-[1px] pl-1 font-sans font-[450] text-900 dark:border-b-[2px] dark:border-b-slate-400/60 dark:text-slate-300">
        {title}
      </div>
      <div className="flex flex-row flex-wrap gap-[0.3rem] divide-y divide-200 justify-self-stretch dark:divide-slate-500">
        {blokes.map((author) => (
          <Bloke key={author.name} detail={author} count={blokes.length} />
        ))}
      </div>
    </div>
  );
};

const Many = ({ title, values, minlen }) => {
  if (!values || values.length === 0) return null;
  return (
    <div className="flex w-full flex-col justify-start gap-3 rounded-lg border-[1px] border-200 p-2 shadow dark:border-slate-500">
      <div className="flex w-full items-center justify-start rounded-t-md bg-100 px-1 font-sans font-[450] text-900 dark:border-b-[2px] dark:border-b-slate-400/60 dark:text-slate-300">
        {title}
      </div>
      <div className="grid flex-auto grid-cols-1 flex-col gap-1 divide-y divide-100 pl-1 dark:divide-slate-500 md:flex">
        {values.map((v) =>
          v.length > minlen ? (
            <div key={v} className="flex min-h-[1.3rem]">
              <span className="font-sans text-[0.9rem] dark:text-slate-300">
                {v}
              </span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

const DownloadCount = ({ count }) => {
  if (!count) return null;
  return (
    <div className="flex w-full flex-col justify-start gap-3 rounded-lg border-[1px] border-200 p-2 shadow dark:border-slate-500">
      <span className="w-full flex-shrink-0 items-center justify-start rounded-t-md bg-100 pl-1 font-sans font-[450] text-900 dark:border-b-[2px] dark:border-b-slate-400/60 dark:text-slate-300">
        Download Count
      </span>
      <span className="pl-1 font-sans text-[0.9rem] dark:text-slate-300">
        {count}
      </span>
    </div>
  );
};

const BookImage = ({ link }) => (
  <div className="flex-shrink-0">
    {link ? (
      <div>
        <img src={link} alt="book" className="shadow-lg" />
      </div>
    ) : (
      <div className="flex h-[180px] w-[150px] items-center justify-center bg-slate-100 shadow dark:bg-slate-700 md:h-[300px] md:w-[200px]">
        👓
      </div>
    )}
  </div>
);

const LinkButtons = ({ formats }) => {
  if (!formats || formats.length === 0) return null;

  const links = getContentLinks(formats);
  const dlinks = links.filter((x) => x.download && x.onlist);
  const rlinks = links.filter((x) => !x.download && x.onlist);
  return (
    <div className="mt-[-0.4rem] flex flex-wrap gap-4 md:mt-0 md:pt-4">
      {dlinks.length === 0 ? null : (
        <div className="flex flex-col">
          <span className="flex-none font-sans text-[0.9rem] dark:text-gray-300 md:w-[12.5rem] md:text-800">
            download as:
          </span>
          <div className="flex flex-none flex-wrap gap-2 pt-[0.5rem]">
            {dlinks.map(({ short, link }) => (
              <div
                key={link}
                className="flex h-8 w-[7rem] flex-none items-center justify-center rounded-sm bg-300 text-900 shadow hover:bg-400 dark:border-[1px] dark:border-slate-500 dark:text-slate-300 dark:shadow-sm dark:shadow-slate-700 dark:hover:bg-slate-700 md:w-[6rem]"
              >
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-center gap-2 dark:fill-slate-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 fill-klor-700/80"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-center text-sm">{short}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      {rlinks.length === 0 ? null : (
        <div className="flex flex-col pt-0">
          <span className="flex-none font-sans text-[0.9rem] dark:text-gray-300 md:w-[12.5rem] md:rounded-t-md md:text-800">
            read as:
          </span>
          <div className="flex flex-none flex-wrap gap-2 pt-[0.5rem]">
            {rlinks.map(({ long, link }) => (
              <div
                key={link}
                className="flex h-8 w-[7rem] flex-none items-center justify-center rounded-sm bg-300 text-900 shadow hover:bg-400 dark:border-[1px] dark:border-slate-500 dark:text-slate-300 dark:shadow-sm dark:shadow-slate-700 dark:hover:bg-slate-700 md:w-[6rem]"
              >
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-center gap-[0.2rem]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 fill-klor-400/80 pt-[4px] dark:fill-slate-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                  <span className="text-center text-sm">{long}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
      <div className="m-6 flex flex-col items-center rounded-sm border-[1px] p-6 shadow">
        <p className="block pb-4">
          Incorrect URL or book id is missing in URL search params.
        </p>
        <p className="cursor font-nav font-medium text-900 underline hover:text-700">
          <Link to="/">HOME</Link>
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 flex flex-col items-center rounded-sm border-[1px] p-6 shadow">
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
    <main className="p-4 text-900 dark:bg-slate-600">
      <div className="flex flex-wrap gap-1 md:hidden">
        <Title text={book ? book.title : null} />
        <div className="flex items-center justify-start gap-4 pt-2 pb-2">
          <BookImage
            link={
              book && book.formats && book.formats.length > 0
                ? getImageLinks(book.formats)[1]
                : ''
            }
          />
          <LinkButtons
            formats={
              book && book.formats && book.formats.length > 0
                ? book.formats
                : []
            }
          />
        </div>
        <div className="flex flex-[3_1_0%] flex-col gap-4">
          <Blokes
            title="Authors"
            blokes={book && book.authors ? book.authors : []}
          />
          <Blokes
            title="Contributers"
            blokes={book && book.contributers ? book.contributers : []}
          />
          <Blokes
            title="Editors"
            blokes={book && book.editors ? book.editors : []}
          />
          <Many
            title="Subjects"
            values={book ? book.subjects : []}
            minlen={5}
          />
          <Many
            title="Bookshelves"
            values={book ? book.bookshelves : []}
            minlen={5}
          />
          <Many
            title="Languages"
            values={book ? book.languages : []}
            minlen={0}
          />
          <DownloadCount count={book ? book.download_count : null} />
        </div>
      </div>

      <div className="hidden flex-row gap-1 md:flex">
        <div className="min-w-[250px] flex-[0_0_0%] flex-col">
          <BookImage
            link={
              book && book.formats && book.formats.length > 0
                ? getImageLinks(book.formats)[1]
                : ''
            }
          />
          <LinkButtons
            formats={
              book && book.formats && book.formats.length > 0
                ? book.formats
                : []
            }
          />
        </div>
        <div className="flex flex-[3_1_0%] flex-col gap-4">
          <Title text={book ? book.title : null} />
          <Blokes
            title="Authors"
            blokes={book && book.authors ? book.authors : []}
          />
          <Blokes
            title="Contributers"
            blokes={book && book.contributers ? book.contributers : []}
          />
          <Blokes
            title="Editors"
            blokes={book && book.editors ? book.editors : []}
          />
          <Many
            title="Subjects"
            values={book ? book.subjects : []}
            minlen={5}
          />
          <Many
            title="Bookshelves"
            values={book ? book.bookshelves : []}
            minlen={5}
          />
          <Many
            title="Languages"
            values={book ? book.languages : []}
            minlen={0}
          />
          <DownloadCount count={book ? book.download_count : null} />
        </div>
      </div>
    </main>
  );
}
