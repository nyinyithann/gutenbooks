import React from 'react';

function AuthorLink({ link, site, title }) {
  return (
    <div className="flex justify-start items-center">
      <span className="flex-shrink-0 w-[4.5rem] text-600 text-left justify-start items-center p-[1px] px-2 m-[2px] bg-50 rounded-r-full dark:text-slate-300 dark:bg-slate-800">
        {site}
      </span>
      <a
        href={link}
        target="blank"
        className="underline hover:cursor-pointer hover:text-600 text-500 pl-2 dark:text-slate-100"
      >
        {title}
      </a>
    </div>
  );
}

function About() {
  return (
    <div className="flex flex-col gap-2 text-600 font-mono text-center h-full items-center justify-center">
      <div className="-mt-40">
        <h1 className="text-2xl text-900 font-bold font-sans dark:text-slate-100">
          Gutenbooks
        </h1>
        <div className="pt-4">
          <a
            target="_blank"
            rel="noreferrer"
            className="text-800 underline text-xl text-center inline font-sans dark:text-slate-100"
            href="https://github.com/nyinyithann/gutenbooks"
          >
            Gutenbooks GitHub Reposistory
          </a>
        </div>
        <div className="pt-2 font-sans text-xl">
          <div className="flex flex-col justify-center items-center font-sans font-normal text-[0.7em] mt-4 pt-2 border-t border-200 dark:border-slate-500">
            <div className="w-24 h-24 relative mb-4">
              <img
                src="https://avatars.githubusercontent.com/u/156037"
                alt="mygithub"
                className="w-full h-full rounded-full border-4 border-300 sepia-0 saturate-150 dark:border-slate-500"
              />
              <span className="bg-900 rounded-full text-xs text-200 p-1 absolute right-1 -top-1 border-2 border-300 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-300">
                By{' '}
              </span>
            </div>
            <div>
              <AuthorLink
                link="https://github.com/nyinyithann"
                title="@nyinyithann"
                site="GitHub"
              />
              <AuthorLink
                link="https://www.linkedin.com/in/nyinyithan/"
                title="@nyinyithann"
                site="LinkedIn"
              />
              <AuthorLink
                link="https://twitter.com/JazzTuyat"
                title="@JazzTuyat"
                site="Twitter"
              />
              <AuthorLink
                link="https://nyinyithan.com"
                title="https://nyinyithan.com"
                site="Blog"
              />
              <AuthorLink
                link="mailto:nyinyithann@gmail.com"
                title="nyinyithann@gmail.com"
                site="Email"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
