import React from 'react';

function Author({ name, webpage }) {
  return (
    <a
      href={webpage || '#'}
      target="_blank"
      rel="noreferrer"
      className="flex flex-none flex-wrap justify-start text-left text-700 underline"
    >
      <span className="flex-auto flex-wrap pr-[0.1rem]"> {name}</span>
    </a>
  );
}

function AuthorList({ authors }) {
  const len = authors ? authors.length : 0;
  if (len > 0) {
    return (
      <div className="flex flex-none font-booktitle dark:font-normal dark:text-gray-300">
        <span className="flex w-[1.4rem] flex-shrink-0 items-center justify-start rounded-r-full bg-200 py-[0.2rem] pl-1 pr-2 text-[0.7rem] text-700 dark:bg-slate-700">
          by
        </span>
        <div className="flex flex-col flex-wrap">
          {authors.map(({ name, webpage }) => (
            <div
              key={name}
              className="flex flex-col flex-wrap pl-2 font-bookinfo md:font-booktitle md:text-[0.8rem]"
            >
              <span className="flex flex-auto flex-wrap line-clamp-6">
                <Author name={name} webpage={webpage} />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function Book(props) {
  const { id, title, authors, downloadCount, imageSrc, links } = props;
  const dlinks = links.filter((x) => x.download);
  const rlinks = links.filter((x) => !x.download);
  return (
    <div className="flex max-h-full min-h-[200px] w-full flex-col border-b-[1px] border-200 py-2 pl-4 dark:border-slate-500 md:ml-4 md:pl-0">
      <div className="flex flex-auto">
        {imageSrc.medium && imageSrc.medium.length > 0 ? (
          <div className="mt-1 h-[99px] w-[70px] flex-none border-[1px] border-slate-100 shadow">
            <a href={`/book?id=${id}`} rel="noreferrer">
              <img src={imageSrc.small} className="h-full w-full" alt="book" />
            </a>
          </div>
        ) : (
          <a
            href={`/book?id=${id}`}
            rel="noreferrer"
            className="mt-1 flex h-[99px] w-[74px] flex-none items-center justify-center border-[1px] border-slate-100 bg-slate-100 shadow-md dark:border-slate-600 dark:bg-slate-700"
          >
            {' '}
            👓
          </a>
        )}
        <div className="flex flex-col pl-4">
          <a
            href={`/book?id=${id}`}
            rel="noreferrer"
            className="flex flex-wrap pb-1 pr-1 font-booktitle text-base font-semibold text-900"
          >
            <span className="break-before-all pr-1 dark:text-slate-200">
              {title}
            </span>
          </a>
          <AuthorList authors={authors} />
          <div className="flex items-center justify-start gap-4 pt-1">
            <span className="flex-none rounded-r-full bg-200 py-[0.2rem] pl-1 pr-2 font-booktitle text-[0.7rem] text-700 dark:bg-slate-700 dark:text-gray-300">
              Download Count
            </span>
            <span className="font-nav text-[0.9rem] dark:text-gray-300">
              {downloadCount}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-4">
        {dlinks.length === 0 ? null : (
          <div className="flex flex-col pt-0">
            <span className="dark-text-light flex-none font-sans text-[0.75rem] text-900">
              download as:
            </span>
            <div className="flex flex-none flex-wrap gap-2 pt-1">
              {dlinks.map(({ short, link }) => (
                <div
                  key={link}
                  className="flex h-8 w-20 flex-none items-center justify-center rounded-sm bg-300 text-900 shadow hover:bg-400 dark:border-[1px] dark:border-slate-500 dark:text-slate-300 dark:shadow-sm dark:shadow-slate-700 dark:hover:bg-slate-700"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 fill-klor-700/80 dark:fill-slate-400"
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
            <span className="dark-text-light flex-none font-sans text-[0.75rem] text-900">
              read as:
            </span>
            <div className="flex flex-none flex-wrap gap-2 pt-1">
              {rlinks.map(({ long, link }) => (
                <div
                  key={link}
                  className="flex h-8 w-28 flex-none items-center justify-center rounded-sm bg-300 text-900 shadow hover:bg-400 dark:border-[1px] dark:border-slate-500 dark:text-slate-300 dark:shadow-sm dark:shadow-slate-700 dark:hover:bg-slate-700"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-center gap-2"
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
    </div>
  );
}

function BookList({ books }) {
  return (
    <div className="w-full">
      {books.map(
        ({ indexId, title, downloadCount, imageSrc, authors, links }) => (
          <div key={indexId}>
            <Book
              key={indexId}
              id={indexId}
              imageSrc={imageSrc}
              title={title}
              authors={authors}
              downloadCount={downloadCount}
              links={links}
            />
          </div>
        )
      )}
    </div>
  );
}

export { Book, BookList };
