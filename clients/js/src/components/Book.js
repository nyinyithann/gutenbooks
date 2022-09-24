import React from 'react';

function Author({ name, webpage }) {
  const authName = name ? <span className="truncate">{name}</span> : null;
  if (webpage) {
    return (
      <a
        href={webpage}
        target="_blank"
        rel="noreferrer"
        className="flex-none inline text-center underline text-primary_800"
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
      <div className="flex flex-wrap flex-none font-booktitle">
        <span className="flex-none px-[0.4rem] py-1 mr-1 bg-primary_100 text-opacity-10 rounded-full text-[0.7rem]">
          by
        </span>
        {authors.map(({ name, webpage }, i) => (
          <div
            key={i}
            className="flex flex-wrap flex-none  md:text-[0.8rem] font-bookinfo md:font-booktitle"
          >
            <Author key={i + len} name={name} webpage={webpage} />
            {authors.length != i + 1 ? (
              <span key={i + 1} className="pr-1 text-primary_500">
                ,
              </span>
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
    <div className="flex flex-col min-h-[200px] max-h-full w-full p-4 border-b-[1px] border-primary_200">
      <div className="flex flex-auto">
        <div className="flex-none mt-1 h-[99px] w-[66px]">
          <a href={imageSrc.medium} target="_blank" rel="noreferrer">
            <img src={imageSrc.small} className="shadow" />
          </a>
        </div>
        <div className="flex flex-col flex-grow pl-2">
          <span className="flex-none pb-1 text-base font-semibold font-booktitle">
            {title}
          </span>
          <AuthorList authors={authors} />
          <span className="flex-none pt-2 text-sm font-bookinfo">
            {`Download Count: ${downloadCount}`}
          </span>
        </div>
      </div>
      {!links || links.length == 0 ? null : (
        <div className="flex flex-col pt-4">
          <span className="flex-none text-xs text-primary_600">
            download as:
          </span>
          <div className="flex flex-wrap flex-none pt-1">
            {links.map(({ type, link }, i) => (
              <div
                key={i}
                className="flex items-center justify-center flex-none h-8 mr-2 rounded-sm shadow w-14 text-primary_900 bg-primary_300"
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
