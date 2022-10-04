import React from 'react';

function Author({ name, webpage }) {
  return (
    <a
      href={webpage ? webpage : '#'}
      target="_blank"
      rel="noreferrer"
      className="flex flex-wrap flex-none text-left underline text-700 justify-start"
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
        <span className="flex justify-start items-center flex-shrink-0 w-[1.4rem] py-[0.2rem] pl-1 pr-2 text-700 text-[0.7rem] rounded-r-full bg-200 dark:bg-slate-700">
          by
        </span>
        <div className="flex flex-col flex-wrap">
          {authors.map(({ name, webpage }) => (
            <div
              key={name}
              className="flex flex-wrap flex-col pl-2 md:text-[0.8rem] font-bookinfo md:font-booktitle"
            >
              <span className="flex flex-wrap flex-auto line-clamp-6">
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
    <div className="flex flex-col min-h-[200px] max-h-full w-full py-2 ml-4 border-b-[1px] border-200 dark:border-slate-500">
      <div className="flex flex-auto">
        {imageSrc.medium && imageSrc.medium.length > 0 ? (
          <div className="flex-none mt-1 h-[99px] w-[70px] shadow border-[1px] border-slate-100">
            <a href={`/book?id=${id}`} rel="noreferrer">
              <img src={imageSrc.small} className="w-full h-full" alt="book" />
            </a>
          </div>
        ) : (
          <a
            href={`/book?id=${id}`}
            rel="noreferrer"
            className="flex-none mt-1 h-[99px] w-[66px] shadow-md bg-slate-100 border-[1px] border-slate-100 flex justify-center items-center"
          >
            {' '}
            👓
          </a>
        )}
        <div className="flex flex-col pl-4">
          <a
            href={`/book?id=${id}`}
            rel="noreferrer"
            className="flex flex-wrap text-base font-semibold font-booktitle text-900 pb-1 pr-1"
          >
            <span className="break-before-all pr-1 dark:text-slate-200">
              {title}
            </span>
          </a>
          <AuthorList authors={authors} />
          <div className="flex gap-4 pt-1 justify-start items-center">
            <span className="flex-none text-[0.7rem] text-700 font-booktitle py-[0.2rem] pl-1 pr-2 rounded-r-full bg-200 dark:text-gray-300 dark:bg-slate-700">
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
            <span className="flex-none text-[0.75rem] text-900 font-sans dark-text-light">
              download as:
            </span>
            <div className="flex flex-wrap flex-none pt-1 gap-2">
              {dlinks.map(({ short, link }) => (
                <div
                  key={link}
                  className="flex items-center justify-center flex-none h-8 rounded-sm shadow w-20 text-900 bg-300 dark:border-[1px] dark:border-slate-500 dark:shadow-sm dark:shadow-slate-700 dark:text-slate-300"
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
                    <span className="text-sm text-center">{short}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        {rlinks.length === 0 ? null : (
          <div className="flex flex-col pt-0">
            <span className="flex-none text-[0.75rem] text-900 font-sans dark-text-light">
              read as:
            </span>
            <div className="flex flex-wrap flex-none pt-1 gap-2">
              {rlinks.map(({ long, link }) => (
                <div
                  key={link}
                  className="flex items-center justify-center flex-none h-8 rounded-sm shadow w-28 text-900 bg-300 dark:border-[1px] dark:border-slate-500 dark:shadow-sm dark:shadow-slate-700 dark:text-slate-300"
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
                      className="w-4 h-4 pt-[4px] fill-klor-400/80 dark:fill-slate-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                    <span className="text-sm text-center">{long}</span>
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
