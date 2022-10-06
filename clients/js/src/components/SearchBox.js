import { Transition } from '@headlessui/react';
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/solid';
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router-dom';

import useDebounce from '../hooks/UseDebounce';
import useQueryParams from '../hooks/UseQueryParams';
import { BookContext } from '../providers/ContextProvider';

const searchboxDropDownId = 'searchbox_dropdown';

function SearchBox({ searchTerm }) {
  const { bookSearch } = useContext(BookContext);
  const { searchBooks, bookSearchLoading, bookSearchError, books } = bookSearch;
  const [delayedQuery, setDelayedQuery] = useDebounce(500, '');
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [_, setUrlQueryParam] = useQueryParams('books');
  const [activeItemId, setActiveItemId] = useState('');
  const [filterField, setFilterField] = useState(3);
  const navigate = useNavigate();

  const searchInputRef = React.useRef(null);
  const menuRef = React.useRef(null);

  const loadDefaultBookList = () => {
    const info = {
      query: '',
      fields: [],
      sortIndex: 0,
      sort: [{ field: 'index_id', order: 'asc' }],
    };

    setDropdownOpen(false);
    setUrlQueryParam(info);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeSearchInput = (e) => {
    const v = e.target.value;
    setDelayedQuery(v);
    setQuery(v);
    if (v) {
      setActiveItemId(0);
      setDropdownOpen(true);
    } else {
      loadDefaultBookList();
    }
  };

  const focusSearchInput = (e) => {
    if (query && query === e.target.value && books.length > 0) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }
  };

  const getFilterFields = useCallback(
    () =>
      filterField === 3
        ? ['title', 'author']
        : filterField === 1
        ? ['title']
        : filterField === 2
        ? ['author']
        : [],
    [filterField]
  );

  const searchAll = () => {
    if (query) {
      const info = {
        query,
        fields: getFilterFields(),
        sortIndex: -1,
        sort: [{ field: '_score', order: 'desc' }],
      };

      setUrlQueryParam(info);
      setDropdownOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const keyUpSearchInput = (e) => {
    if (e.code === 'Enter' || e.which === 13) {
      const fn = () => {
        searchAll();
        setDropdownOpen(false);
      };
      if (dropdownOpen) {
        if (activeItemId) {
          navigate({
            pathname: '/book',
            search: `?id=${activeItemId.split('_')[1]}`,
          });
        } else {
          fn();
        }
      } else {
        fn();
      }
    } else if (dropdownOpen) {
      const firstSearchItem = document.querySelector(
        `#${searchboxDropDownId} li:first-child`
      );
      const lastSearchItem = document.querySelector(
        `#${searchboxDropDownId} li:last-child`
      );
      if (e.code === 'Escape') {
        setDropdownOpen(false);
      }
      if (e.code === 'ArrowDown') {
        if (activeItemId) {
          if (activeItemId === lastSearchItem.id) {
            setActiveItemId(firstSearchItem.id);
          } else {
            const adjacentItem = document.querySelector(
              `#${activeItemId} + li`
            );
            if (adjacentItem) {
              setActiveItemId(adjacentItem.id);
            }
          }
        } else if (firstSearchItem) {
          setActiveItemId(firstSearchItem.id);
        }
      }
      if (e.code === 'ArrowUp') {
        if (activeItemId) {
          if (activeItemId === firstSearchItem.id) {
            setActiveItemId(lastSearchItem.id);
          } else {
            const currentItem = document.querySelector(`#${activeItemId}`);
            if (currentItem) {
              const order = +currentItem.getAttribute('data-order');
              const previousItem = document.querySelector(
                `#${searchboxDropDownId} li[data-order='${order - 1}']`
              );
              if (previousItem) {
                setActiveItemId(previousItem.id);
              }
            }
          }
        }
      }
    }
  };

  const clickDeleteBtn = (e) => {
    e.preventDefault();
    setDelayedQuery('');
    setQuery('');
    loadDefaultBookList();
  };

  const hoverDropdown = (e) => {
    e.preventDefault();
    setActiveItemId(e.currentTarget.id);
  };

  const mouseDownSearchItem = (e) => {
    e.preventDefault();
    if (activeItemId) {
      navigate({
        pathname: '/book',
        search: `?id=${activeItemId.split('_')[1]}`,
      });
    }
  };

  useEffect(() => {
    setDropdownOpen(false);
    setQuery(searchTerm);
    setDelayedQuery(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const mousedown = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
        setActiveItemId('');
      }
    };
    document.addEventListener('mousedown', mousedown);

    return () => {
      document.removeEventListener('mousedown', mousedown);
    };
  });

  useEffect(() => {
    const q = delayedQuery ? delayedQuery.trim() : '';
    const fields = q ? getFilterFields() : [];
    searchBooks({
      query: q,
      fields,
    });
  }, [delayedQuery]);

  const menuClass = `relative text-base focus:outline-none z-[100] top-[-1.5rem] ${
    dropdownOpen ? 'block' : 'hidden'
  }`;

  const btnSearchClass = `flex-auto mr-3 ${
    query ? 'cursor-pointer' : 'cursor-not-allowed'
  } ${bookSearchLoading ? 'hidden' : 'block'}`;

  const spinnerClass = `flex-auto items-center mr-3 w-6 h-6 ${
    bookSearchLoading ? 'flex' : 'hidden'
  }`;

  const removeSearchBtnClass = `flex-auto top-0 right-0 mr-3 disabled ${
    query ? 'block' : 'hidden'
  }`;

  const getActiveItemStyle = (indexId) =>
    `searchitem_${indexId}` === activeItemId ? 'bg-300/40 dark-bg-mask-md' : '';

  const searchFilterRadioClass =
    'h-5 w-5 md:h-4 md:w-4 hover:cursor form-radio text-600 focus:ring-1 focus:ring-300 dark-bg-mask';
  const searchFilterRadioLabelClass = 'block text-sm ml-2 cursor text-900';

  return (
    <div className="z-100 relative mx-auto flex w-full flex-col pt-1">
      <div className="dark-bg-mask dark-border flex w-full rounded-md border-[1px] border-300 bg-white hover:border-500 focus:outline-none dark:hover:border-slate-500">
        <input
          className="text-medium dark-bg-light h-9 w-[80%] flex-auto rounded-l-md border-0 px-2 outline-none focus:ring-0 md:h-8 md:text-sm md:font-normal"
          type="text"
          name="search"
          maxLength="64"
          autoComplete="off"
          spellCheck="false"
          placeholder="Search by Book Title, Author"
          ref={searchInputRef}
          value={query}
          onChange={changeSearchInput}
          onMouseDown={focusSearchInput}
          onFocus={focusSearchInput}
          onKeyUp={keyUpSearchInput}
        />
        <div className="dark-bg-light top-[-2px] right-0 flex items-center rounded-r-md md:top-0">
          <span
            className={`w-36 pl-1 pr-2 text-[0.7rem] text-red-400 ${
              bookSearchError ? 'block' : 'hidden'
            }`}
          >
            Error. Please try again.
          </span>
          <button
            type="button"
            className={removeSearchBtnClass}
            disabled={!query}
            onClick={clickDeleteBtn}
          >
            <XCircleIcon className="h-6 w-6 text-slate-500" />
          </button>
          <button
            type="button"
            className={btnSearchClass}
            onClick={searchAll}
            disabled={!query}
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-slate-500" />
          </button>

          <div className={spinnerClass}>
            <ReactLoading
              type="spin"
              color="#475569"
              height={16}
              width={16}
              className="self-center"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-1 pl-2">
        <div className="dark-text flex space-x-6">
          <div className="flex items-center">
            <input
              id="search_filter_all"
              name="search_filter"
              type="radio"
              defaultChecked={filterField === 3}
              className={searchFilterRadioClass}
              onClick={() => setFilterField(3)}
            />
            <label
              htmlFor="search_filter_all"
              className={searchFilterRadioLabelClass}
            >
              all
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="search_filter_title"
              name="search_filter"
              type="radio"
              defaultChecked={filterField === 1}
              className={searchFilterRadioClass}
              onClick={() => setFilterField(1)}
            />
            <label
              htmlFor="search_filter_title"
              className={searchFilterRadioLabelClass}
            >
              title
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="search_filter_author"
              name="search_filter"
              type="radio"
              defaultChecked={filterField === 2}
              className={searchFilterRadioClass}
              onClick={() => setFilterField(2)}
            />
            <label
              htmlFor="search_filter_author"
              className={searchFilterRadioLabelClass}
            >
              author
            </label>
          </div>
        </div>
      </div>
      <div role="menu" ref={menuRef} className={menuClass}>
        <Transition
          as={Fragment}
          show
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <ul
            role="menu"
            className="absolute flex w-full list-none flex-col rounded border-[1px] border-[#ededed] bg-slate-50 shadow-lg dark:border-slate-500 dark:bg-slate-600 dark:text-slate-200"
          >
            <li>
              <ul id={searchboxDropDownId} tabIndex="0">
                {books.map(({ indexId, title, authors, imageSrc }, i) => (
                  <li
                    id={`searchitem_${indexId}`}
                    key={indexId}
                    role="menuitem"
                    data-order={i}
                    className={`inline-block w-full focus:outline-none ${getActiveItemStyle(
                      indexId
                    )}`}
                    onMouseOver={hoverDropdown}
                    onFocus={hoverDropdown}
                    onMouseDown={mouseDownSearchItem}
                  >
                    <div
                      tabIndex="-1"
                      className="inline-block w-full focus:outline-none"
                    >
                      <div className="dark-border-light flex border-b-[1px] border-b-[#cccccc] pb-1 pt-2">
                        {imageSrc.small && imageSrc.small.length > 0 ? (
                          <img
                            src={imageSrc.small}
                            alt="book"
                            className="my-1 ml-2 h-[50px] w-[35px] flex-shrink-0 shadow"
                          />
                        ) : (
                          <div className="my-1 ml-2 h-[50px] w-[35px] flex-shrink-0 border-[1px] border-slate-100 bg-slate-100 shadow-500" />
                        )}
                        <div className="flex flex-grow flex-col items-start pl-2">
                          <p className="flex-none pr-1 pb-1 text-left font-booktitle text-[0.9rem] font-semibold line-clamp-1 md:text-[0.8rem] md:line-clamp-3">
                            {title}
                          </p>
                          <div className="dark-text-md text-left font-booktitle text-[0.9rem] text-[#606060] md:text-[0.7rem]">
                            <span key="by">
                              {`by ${authors
                                .reduceRight((px, x) => `${x.name} | ${px}`, '')
                                .replace(/[| ]+$/g, '')}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
            <li
              role="menuitem"
              className="inline-flex w-full pt-1 pb-2 text-center focus:outline-none"
            >
              <button
                type="button"
                aria-label="search all"
                className="inline w-full px-2 text-sm text-900 md:text-[0.9rem]"
                onMouseDown={searchAll}
              >
                <p className="px-2 line-clamp-6">
                  {`See all results for "${query}"`}
                </p>
              </button>
            </li>
          </ul>
        </Transition>
      </div>
    </div>
  );
}

export default SearchBox;
