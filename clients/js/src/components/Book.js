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
              <span className="pr-1 text-900"> ⃓</span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function Book(props) {
  const { title, authors, downloadCount, imageSrc, links } = props;

  return (
    <div className="flex flex-col min-h-[200px] max-h-full w-full p-4 border-b-[1px] border-200">
      <div className="flex flex-auto">
        {imageSrc.medium && imageSrc.medium.length > 0 ? (
          <div className="flex-none mt-1 h-[99px] w-[70px] shadow border-[1px] border-slate-100">
            <a href={imageSrc.medium} target="_blank" rel="noreferrer">
              <img src={imageSrc.small} className="w-full h-full" alt="book" />
            </a>
          </div>
        ) : (
          <div className="flex-none mt-1 h-[99px] w-[66px] shadow-md bg-slate-100 border-[1px] border-slate-100" />
        )}
        <div className="flex flex-col flex-grow pl-4">
          <span className="flex-none pb-1 text-base font-semibold font-booktitle text-900">
            {title}
          </span>
          <AuthorList authors={authors} />
          <span className="flex-none pt-6 text-sm text-900 font-bookinfo">
            {`Download Count: ${downloadCount}`}
          </span>
        </div>
      </div>
      {!links || links.length === 0 ? null : (
        <div className="flex flex-col pt-4">
          <span className="flex-none text-sm text-900 font-bookinfo">
            download as:
          </span>
          <div className="flex flex-wrap flex-none pt-1">
            {links.map(({ type, link }) => (
              <div
                key={link}
                className="flex items-center justify-center flex-none h-8 mr-2 rounded-sm shadow w-14 text-900 bg-300"
              >
                <a href={link} target="_blank" rel="noreferrer">
                  <span className="text-sm text-center">{type}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BookList({ books }) {
  return (
    <div className="w-full">
      {books.map(({ id, title, downloadCount, imageSrc, authors, links }) => (
        <div key={id}>
          <Book
            key={id}
            imageSrc={imageSrc}
            title={title}
            authors={authors}
            downloadCount={downloadCount}
            links={links}
          />
        </div>
      ))}
    </div>
  );
}

export { Book, BookList };
