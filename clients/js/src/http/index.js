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
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,HEAD,OPTIONS,DELETE,PUT',
    'Content-type': 'application/json',
    'Cache-Control': 'max-age=172800', // 2 days
  },
});

const searchBooks = async (payload) =>
  client.post(`${process.env.API_PATH}/search`, payload);

const getBooks = async (payload) =>
  client.post(`${process.env.API_PATH}`, payload);

const getBookById = async (id) => client.get(`${process.env.API_PATH}/${id}`);

const getBookshelves = async () =>
  client.get(`${process.env.API_PATH}/bookshelves`);

export { getBookById, getBooks, getBookshelves, searchBooks };
