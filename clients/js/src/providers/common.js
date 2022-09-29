const API_SERVER_STATUS = {
  SUCCESS: 'Ok',
  FAIL: 'Error',
};

const ACTIONS = {
  LOADING: 'Loading',
  LOADED: 'Loaded',
  LOADEDMORE: 'LoadedMore',
  ERROR: 'Error',
};

const convertToBookViewModelList = (hits) =>
  hits.map((hit) => {
    const medium = hit.formats.find(
      (x) =>
        x.type.toLowerCase() === 'image/jpeg' &&
        x.link.toLowerCase().includes('medium')
    );
    const small = hit.formats.find(
      (x) =>
        x.type.toLowerCase() === 'image/jpeg' &&
        x.link.toLowerCase().includes('small')
    );
    const map = new Map();
    hit.formats.forEach(({ type, link }) => {
      if (
        type.toLowerCase() === 'application/epub+zip' &&
        link.toLowerCase().includes('noimages')
      ) {
        map.set('epub', link);
      }
      if (
        type.toLowerCase() === 'application/x-mobipocket-ebook' &&
        link.toLowerCase().includes('noimages')
      ) {
        map.set('kindle', link);
      }
      if (type.toLowerCase() === 'text/plain') {
        map.set('text', link);
      }
      if (type.toLowerCase() === 'text/html') {
        map.set('html', link);
      }
      if (type.toLowerCase() === 'application/zip') {
        map.set('zip', link);
      }
    });

    const links = [];
    map.forEach((value, key) => {
      links.push({ type: key, link: value });
    });
    links.sort((x, y) => {
      const xt = x.type.toLowerCase();
      const yt = y.type.toLowerCase();
      if (xt < yt) return -1;
      if (yt > xt) return 1;
      return 0;
    });

    return {
      id: hit.id,
      indexId: hit.index_id,
      title: hit.title,
      downloadCount: hit.download_count,
      imageSrc: {
        medium: medium && medium.link ? medium.link : '',
        small: small && small.link ? small.link : '',
      },
      authors: hit.authors.map(({ name, webpage }) => ({
        name,
        webpage,
      })),
      links,
    };
  });

const dispatchError = (errorMessage, dispatch) =>
  dispatch({
    type: ACTIONS.ERROR,
    payload: {
      loading: false,
      error: errorMessage,
    },
  });

export {
  ACTIONS,
  API_SERVER_STATUS,
  convertToBookViewModelList,
  dispatchError,
};
