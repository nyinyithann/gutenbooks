import React from 'react';
import ReactLoading from 'react-loading';

function Loading({ type, color, height, width }) {
  return (
    <div className="flex w-full items-center justify-center">
      <ReactLoading
        type={type || 'bubbles'}
        color={color || '#cbd5e1'}
        height={height}
        width={width}
      />
    </div>
  );
}

export default Loading;
