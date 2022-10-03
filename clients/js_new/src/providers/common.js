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

const getImageLinks = (formats) => {
  const medium = formats.find(
    (x) =>
      x.type.toLowerCase().includes('image/jpeg') &&
      x.link.toLowerCase().includes('medium')
  );
  const small = formats.find(
    (x) =>
      x.type.toLowerCase().includes('image/jpeg') &&
      x.link.toLowerCase().includes('small')
  );
  return [
    small && small.link ? small.link : '',
    medium && medium.link ? medium.link : '',
  ];
};

const getContentLinks = (formats) => {
  let isTextPlainAdded = false;
  let isTextZipAdded = false;
  const links = [];
  formats.forEach(({ type, link }) => {
    if (
      type.toLowerCase().includes('application/epub+zip') &&
      link.toLowerCase().endsWith('.epub.images')
    ) {
      links.push({
        sorthint: 1,
        onlist: true,
        type: 'epub_images',
        short: 'epub',
        long: 'epub with images',
        download: true,
        link,
      });
    }

    if (
      type.toLowerCase().includes('application/epub+zip') &&
      link.toLowerCase().endsWith('.epub.noimages')
    ) {
      links.push({
        sorthint: 2,
        onlist: false,
        type: 'epub_noimages',
        short: 'epub',
        long: 'epub without images',
        download: true,
        link,
      });
    }

    if (
      type.toLowerCase().includes('application/x-mobipocket-ebook') &&
      link.toLowerCase().endsWith('.images')
    ) {
      links.push({
        sorthint: 3,
        onlist: true,
        type: 'kindle_images',
        short: 'kindle',
        long: 'kindle with images',
        download: true,
        link,
      });
    }
    if (
      type.toLowerCase().includes('application/x-mobipocket-ebook') &&
      link.toLowerCase().endsWith('.noimages')
    ) {
      links.push({
        sorthint: 4,
        onlist: false,
        type: 'kindle_noimages',
        short: 'kindle',
        long: 'kindle without images',
        download: true,
        link,
      });
    }

    if (
      type.toLowerCase().includes('text/html') &&
      link.toLowerCase().endsWith('.zip')
    ) {
      links.push({
        sorthint: 5,
        onlist: true,
        type: 'html_zip',
        short: 'html',
        long: 'html zip',
        download: true,
        link,
      });
    }
    if (
      type.toLowerCase().includes('text/html') &&
      link.toLowerCase().endsWith('.htm')
    ) {
      links.push({
        sorthint: 6,
        onlist: true,
        type: 'html',
        short: 'html',
        long: 'linked text',
        download: false,
        link,
      });
    }

    if (
      type.toLowerCase().includes('text/plain') &&
      link.toLowerCase().endsWith('.zip') &&
      !isTextZipAdded
    ) {
      isTextZipAdded = true;
      links.push({
        sorthint: 7,
        onlist: true,
        type: 'text_plain_zip',
        short: 'text',
        long: 'text zip',
        download: true,
        link,
      });
    }
    if (
      type.toLowerCase().includes('text/plain') &&
      link.toLowerCase().endsWith('.txt') &&
      !isTextPlainAdded
    ) {
      isTextPlainAdded = true;
      links.push({
        sorthint: 8,
        onlist: true,
        type: 'text_plain',
        short: 'text',
        long: 'plain text',
        download: false,
        link,
      });
    }

    if (type.toLowerCase().includes('application/zip')) {
      links.push({
        sorthint: 9,
        onlist: true,
        type: 'zip',
        short: 'zip',
        long: 'zip',
        download: true,
        link,
      });
    }

    if (
      type.toLowerCase().includes('application/octet-stream') &&
      link.toLowerCase().endsWith('pdf.zip')
    ) {
      links.push({
        sorthint: 10,
        onlist: true,
        type: 'pdf_zip',
        short: 'pdf',
        long: 'pdf zip',
        download: true,
        link,
      });
    }
    if (
      type.toLowerCase().includes('application/pdf') &&
      link.toLowerCase().endsWith('pdf.pdf')
    ) {
      links.push({
        sorthint: 11,
        onlist: true,
        type: 'pdf',
        short: 'pdf',
        long: 'pdf',
        download: false,
        link,
      });
    }

    if (
      type.toLowerCase().includes('application/rdf+xml') &&
      link.toLowerCase().endsWith('.rdf')
    ) {
      links.push({
        sorthint: 12,
        onlist: false,
        type: 'rdf',
        short: 'xml',
        long: 'xml',
        download: true,
        link,
      });
    }

    if (
      type.toLowerCase().includes('audio/mpeg') &&
      link.toLowerCase().endsWith('.zip')
    ) {
      links.push({
        sorthint: 13,
        onlist: true,
        type: 'mp3',
        short: 'mp3',
        long: 'mp3',
        download: true,
        link,
      });
    }
  });

  links.sort((x, y) => x.sorthint - y.sorthint);

  return links;
};

const convertToBookViewModelList = (hits) =>
  hits.map((hit) => {
    const [small, medium] = getImageLinks(hit.formats);
    const links = getContentLinks(hit.formats).filter((x) => x.onlist);
    return {
      id: hit.id,
      indexId: hit.index_id,
      title: hit.title,
      downloadCount: hit.download_count,
      imageSrc: {
        small,
        medium,
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
  getImageLinks,
  getContentLinks,
};
