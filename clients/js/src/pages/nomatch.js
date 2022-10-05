import React from 'react';
import { Link } from 'react-router-dom';

function NoMatch() {
  return (
    <div className="flex flex-col items-center pt-20 text-center text-lg font-medium text-slate-600">
      <div className="relative h-0 w-full pb-40">
        <iframe
          title="nomatch"
          src="https://giphy.com/embed/0s4qt8wXIkI2S6nqqp"
          width="100%"
          height="100%"
          frameBorder="0"
          className="absolute"
          allowFullScreen
        />
      </div>
      <p>
        <a href="https://giphy.com/gifs/thismorning-itv-this-morning-0s4qt8wXIkI2S6nqqp" />
      </p>
      <span className="my-5">
        {`Hmm... this page doesn't exist. Please go to the home page by clicking
        on the link below.`}
      </span>
      <p className="cursor font-nav font-medium text-900 underline hover:text-700">
        <Link to="/">HOME</Link>
      </p>
    </div>
  );
}

export default NoMatch;
