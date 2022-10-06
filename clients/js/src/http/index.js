import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import localforage from 'localforage';

const forageStore = localforage.createInstance({
  name: 'gutenboks_cache',
  driver: [localforage.LOCALSTORAGE, localforage.INDEXEDDB],
});

const cache = setupCache({
  readHeaders: true, // read Cache-Control value from response headers
  store: forageStore,
  exclude: {
    methods: ['put', 'patch', 'delete'],
  },
  clearOnStale: true,
  clearOnError: true,
});

const client = axios.create({
  adapter: cache.adapter,
  headers: {
    'Content-type': 'application/json',
    'Cache-Control': 'max-age=172800', // 2 days
  },
});

const searchBooks = async (payload) =>
  client.post('http://54.255.67.106/api/books/search', payload);

const getBooks = async (payload) =>
  client.post('http://54.255.67.106/api/books', payload);

const getBookById = async (id) => client.get(`http://54.255.67.106/api/books/${id}`);

const getBookshelves = async () =>
  client.get(`http://54.255.67.106/api/books/bookshelves`);

export { getBookById, getBooks, getBookshelves, searchBooks };
