import React from 'react';

function Author({ name, webpage }) {
  const authName = name ? <span className="truncate">{name}</span> : null;
  if (webpage) {
    return (
      <a
        href={webpage}
        target="_blank"
        rel="noreferrer"
        className="flex-none inline text-center underline text-700"
      >
        {authName}
      </a>
    );
  }
  return authName;
}

function AuthorList({ authors }) {
  const len = authors ? authors.length : 0;
  if (len > 0) {
    return (
      <div className="flex flex-wrap flex-none font-booktitle pt-2">
        <span className="flex-none px-[0.4rem] py-1 mr-1 bg-100 text-700 rounded-full text-[0.7rem]">
          by
        </span>
        {authors.map(({ name, webpage }, i) => (
          <div
            key={name}
            className="flex flex-wrap flex-none pt-[2px] pl-2 md:text-[0.8rem] font-bookinfo md:font-booktitle"
          >
            <Author name={name} webpage={webpage} />
            {authors.length !== i + 1 ? (
              <span className="pr-1 text-300"> ⃓</span>
            ) : null}
          </div>
        ))}
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
    <div className="flex flex-col min-h-[200px] max-h-full w-full p-4 border-b-[1px] border-200">
      <div className="flex flex-auto">
        {imageSrc.medium && imageSrc.medium.length > 0 ? (
          <div className="flex-none mt-1 h-[99px] w-[70px] shadow border-[1px] border-slate-100">
            <a href={`/book?id=${id}`} target="_blank" rel="noreferrer">
              <img src={imageSrc.small} className="w-full h-full" alt="book" />
            </a>
          </div>
        ) : (
          <a
            href={`/book?id=${id}`}
            target="_blank"
            rel="noreferrer"
            className="flex-none mt-1 h-[99px] w-[66px] shadow-md bg-slate-100 border-[1px] border-slate-100 flex justify-center items-center"
          > 👓</a>
        )}
        <div className="flex flex-col flex-grow pl-4">
          <a
            href={`/book?id=${id}`}
            target="_blank"
            rel="noreferrer"
            className="flex-none pb-1 text-base font-semibold font-booktitle text-900"
          >
            {title}
          </a>
          <AuthorList authors={authors} />
          <span className="flex-none pt-6 text-[0.8rem] text-900 font-sans">
            {`Download Count: ${downloadCount}`}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 pt-4">
        {dlinks.length === 0 ? null : (
          <div className="flex flex-col pt-0">
            <span className="flex-none text-[0.75rem] text-900 font-sans">
              download as:
            </span>
            <div className="flex flex-wrap flex-none pt-1 gap-2">
              {dlinks.map(({ short, link }) => (
                <div
                  key={link}
                  className="flex items-center justify-center flex-none h-8 rounded-sm shadow w-20 text-900 bg-300"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-center gap-2"
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
                    <span className="text-sm text-center">{short}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        {rlinks.length === 0 ? null : (
          <div className="flex flex-col pt-0">
            <span className="flex-none text-[0.75rem] text-900 font-sans">
              read as:
            </span>
            <div className="flex flex-wrap flex-none pt-1 gap-2">
              {rlinks.map(({ short, link }) => (
                <div
                  key={link}
                  className="flex items-center justify-center flex-none h-8 rounded-sm shadow w-20 text-900 bg-300"
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
                      className="w-4 h-4 pt-[4px] fill-klor-400/80"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                    <span className="text-sm text-center">{short}</span>
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
